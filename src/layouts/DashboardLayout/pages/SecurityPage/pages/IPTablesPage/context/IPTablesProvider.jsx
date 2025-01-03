import { PropTypes } from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePackageManager } from "../../../../../context/DashboardLayoutContext";
import { IPTablesContext } from "./IPTablesContext";

function IPTablesProvider({ children }) {
  const [activeTab, setActiveTab] = useState("filter");
  const [filterRules, setFilterRules] = useState({
    policies: [],
    customChains: [],
    rules: [],
    references: [],
    details: [],
  });
  const [natRules, setNatRules] = useState({
    policies: [],
    customChains: [],
    rules: [],
    references: [],
    details: [],
  });
  const [mangleRules, setMangleRules] = useState({
    policies: [],
    customChains: [],
    rules: [],
    references: [],
    details: [],
  });
  const [rawRules, setRawRules] = useState({
    policies: [],
    customChains: [],
    rules: [],
    references: [],
    details: [],
  });
  const [securityRules, setSecurityRules] = useState({
    policies: [],
    customChains: [],
    rules: [],
    references: [],
    details: [],
  });
  const [isIPTablesLoading, setIsIPTablesLoading] = useState(false);

  const { packages } = usePackageManager();

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  function parseIptablesRules(rulesText) {
    const rules = rulesText.filter((line) => line.trim());
    const chains = new Map();

    // Önce tüm chain'leri bul
    rules.forEach((rule) => {
      if (rule.startsWith("-N ")) {
        const chainName = rule.split(" ")[1];
        chains.set(chainName, {
          name: chainName,
          parents: [],
          children: [],
          rules: [],
        });
      }
    });

    // Chain'ler arası bağlantıları ve kuralları bul
    rules.forEach((rule) => {
      if (!rule.startsWith("-A ")) {
        return;
      }

      const parts = rule.split(" ");
      const sourceChain = parts[1];

      // -j ile biten hedef chain'i bul
      const targetIndex = parts.indexOf("-j");
      if (targetIndex !== -1 && targetIndex + 1 < parts.length) {
        const targetChain = parts[targetIndex + 1];

        // Eğer hedef bir chain ise (ACCEPT, DROP, LOG değilse)
        if (chains.has(targetChain)) {
          chains.get(sourceChain)?.children.push(targetChain);
          chains.get(targetChain)?.parents.push(sourceChain);
        }
      }

      // Kuralı kaydet
      if (chains.has(sourceChain)) {
        chains.get(sourceChain).rules.push(rule);
      }
    });

    return chains;
  }

  const getChainStructureAsJson = useCallback(
    (chainName, chains, chainOrder) => {
      const chain = chains.get(chainName);
      if (!chain) return { error: `Chain ${chainName} not found` };

      // Kuralları numaralandır ve yapılarını analiz et
      const numberedRules = chain.rules.map((rule, index) => {
        const ruleParts = rule.split(" ").filter((part) => part);
        return {
          number: index + 1,
          rule,
          structure: {
            chain: ruleParts[1],
            target: ruleParts[ruleParts.indexOf("-j") + 1] || "NONE",
            protocol: ruleParts.includes("-p")
              ? ruleParts[ruleParts.indexOf("-p") + 1]
              : "all",
            port: ruleParts.includes("--dport")
              ? ruleParts[ruleParts.indexOf("--dport") + 1]
              : "any",
            source: ruleParts.includes("-s")
              ? ruleParts[ruleParts.indexOf("-s") + 1]
              : "any",
          },
        };
      });

      return {
        name: chainName,
        orderInInput: chainOrder[chainName] || 0,
        structure: {
          type: chain.name.includes("_") ? "custom" : "built-in",
          level: getChainLevel(chain, chains),
        },
        parents: chain.parents.length
          ? chain.parents.map((parent) => ({
              name: parent,
              orderInParent: chainOrder[parent] || 0,
            }))
          : [],
        children: chain.children.length
          ? chain.children.map((child) => ({
              name: child,
              orderInChain: chainOrder[child] || 0,
            }))
          : [],
        rules: numberedRules,
        totalRules: numberedRules.length,
      };
    },
    [],
  );

  function getChainLevel(chain, chains) {
    if (chain.parents.includes("INPUT")) {
      return 1;
    } else if (
      chain.parents.some((p) => chains.get(p)?.parents.includes("INPUT"))
    ) {
      return 2;
    } else {
      return 3;
    }
  }

  const getAllChainsAsJson = useCallback(
    (chains) => {
      // Chain sıralamasını belirle
      const chainOrder = {};
      let order = 1;

      // INPUT chain'inden başlayarak sıralama yap
      const inputRules =
        Array.from(chains.values()).find((chain) => chain.name === "INPUT")
          ?.rules || [];

      inputRules.forEach((rule) => {
        const target = rule
          .split(" ")
          .find((part, i, arr) => arr[i - 1] === "-j");
        if (target && chains.has(target)) {
          chainOrder[target] = order++;
        }
      });

      // Diğer chain'leri sırala
      Array.from(chains.keys()).forEach((chainName) => {
        if (!chainOrder[chainName]) {
          chainOrder[chainName] = order++;
        }
      });

      const chainsJson = {
        chains: [],
        totalChains: chains.size,
        structure: {
          mainChains: ["INPUT", "FORWARD", "OUTPUT"],
          customChains: Array.from(chains.keys()).filter((name) =>
            name.includes("_"),
          ),
          levels: {
            1: [], // INPUT'a direkt bağlı
            2: [], // INPUT'a bağlı chain'lere bağlı
            3: [], // Diğer alt chain'ler
          },
        },
      };

      chains.forEach((chain, chainName) => {
        const chainJson = getChainStructureAsJson(
          chainName,
          chains,
          chainOrder,
        );
        chainsJson.chains.push(chainJson);

        // Seviyeleri doldur
        if (chainJson.structure.level) {
          chainsJson.structure.levels[chainJson.structure.level].push(
            chainName,
          );
        }
      });

      return chainsJson;
    },
    [getChainStructureAsJson],
  );

  const fetchRules = useCallback(
    async (loading = true) => {
      setIsIPTablesLoading(loading);

      try {
        // Filter Table
        const filterData = await window.Electron.ssh.executeCommand(
          "iptables -S",
        );
        const filterLines = filterData.output.split("\n");

        const policies = filterLines.filter((line) => line.startsWith("-P"));
        const customChains = filterLines.filter((line) =>
          line.startsWith("-N"),
        );
        const rules = filterLines.filter((line) => line.startsWith("-A"));
        const references = rules
          .filter((rule) => {
            const chainName = rule.split(" ")[3];
            return rule.endsWith(`-j ${chainName}`);
          })
          .map((rule) => {
            const mainChainName = rule.split(" ")[1];
            const connectedChainName = rule.split(" ")[3];

            return `${mainChainName}:${connectedChainName}`;
          });

        const IpTablesChains = parseIptablesRules(filterLines);

        const details = getAllChainsAsJson(IpTablesChains);

        setFilterRules({ policies, customChains, rules, references, details });
        // END Filter Table

        // NAT Table
        const natData = await window.Electron.ssh.executeCommand(
          "iptables -t nat -S",
        );
        const natLines = natData.output.split("\n");

        const natPolicies = natLines.filter((line) => line.startsWith("-P"));
        const natCustomChains = natLines.filter((line) =>
          line.startsWith("-N"),
        );
        const natRules = natLines.filter((line) => line.startsWith("-A"));
        const natReferences = natRules
          .filter((rule) => {
            const chainName = rule.split(" ")[3];
            return rule.endsWith(`-j ${chainName}`);
          })
          .map((rule) => {
            const mainChainName = rule.split(" ")[1];
            const connectedChainName = rule.split(" ")[3];

            return `${mainChainName}:${connectedChainName}`;
          });

        const natIpTablesChains = parseIptablesRules(natLines);

        const natDetails = getAllChainsAsJson(natIpTablesChains);

        setNatRules({
          policies: natPolicies,
          customChains: natCustomChains,
          rules: natRules,
          references: natReferences,
          details: natDetails,
        });
        // END NAT Table

        // Mangle Table
        const mangleData = await window.Electron.ssh.executeCommand(
          "iptables -t mangle -S",
        );
        const mangleLines = mangleData.output.split("\n");

        const manglePolicies = mangleLines.filter((line) =>
          line.startsWith("-P"),
        );
        const mangleCustomChains = mangleLines.filter((line) =>
          line.startsWith("-N"),
        );
        const mangleRules = mangleLines.filter((line) => line.startsWith("-A"));
        const mangleReferences = mangleRules
          .filter((rule) => {
            const chainName = rule.split(" ")[3];
            return rule.endsWith(`-j ${chainName}`);
          })
          .map((rule) => {
            const mainChainName = rule.split(" ")[1];
            const connectedChainName = rule.split(" ")[3];

            return `${mainChainName}:${connectedChainName}`;
          });

        const mangleIpTablesChains = parseIptablesRules(mangleLines);

        const mangleDetails = getAllChainsAsJson(mangleIpTablesChains);

        setMangleRules({
          policies: manglePolicies,
          customChains: mangleCustomChains,
          rules: mangleRules,
          references: mangleReferences,
          details: mangleDetails,
        });
        // END Mangle Table

        // RAW Table
        const rawData = await window.Electron.ssh.executeCommand(
          "iptables -t raw -S",
        );
        const rawLines = rawData.output.split("\n");

        const rawPolicies = rawLines.filter((line) => line.startsWith("-P"));
        const rawCustomChains = rawLines.filter((line) =>
          line.startsWith("-N"),
        );
        const rawRules = rawLines.filter((line) => line.startsWith("-A"));
        const rawReferences = rawRules
          .filter((rule) => {
            const chainName = rule.split(" ")[3];
            return rule.endsWith(`-j ${chainName}`);
          })
          .map((rule) => {
            const mainChainName = rule.split(" ")[1];
            const connectedChainName = rule.split(" ")[3];

            return `${mainChainName}:${connectedChainName}`;
          });

        const rawIpTablesChains = parseIptablesRules(rawLines);

        const rawDetails = getAllChainsAsJson(rawIpTablesChains);

        setRawRules({
          policies: rawPolicies,
          customChains: rawCustomChains,
          rules: rawRules,
          references: rawReferences,
          details: rawDetails,
        });
        // END RAW Table

        //  Security Table
        const securityData = await window.Electron.ssh.executeCommand(
          "iptables -t security -S",
        );
        const securityLines = securityData.output.split("\n");

        const securityPolicies = securityLines.filter((line) =>
          line.startsWith("-P"),
        );
        const securityCustomChains = securityLines.filter((line) =>
          line.startsWith("-N"),
        );
        const securityRules = securityLines.filter((line) =>
          line.startsWith("-A"),
        );
        const securityReferences = securityRules
          .filter((rule) => {
            const chainName = rule.split(" ")[3];
            return rule.endsWith(`-j ${chainName}`);
          })
          .map((rule) => {
            const mainChainName = rule.split(" ")[1];
            const connectedChainName = rule.split(" ")[3];

            return `${mainChainName}:${connectedChainName}`;
          });

        const securityIpTablesChains = parseIptablesRules(securityLines);

        const securityDetails = getAllChainsAsJson(securityIpTablesChains);

        setSecurityRules({
          policies: securityPolicies,
          customChains: securityCustomChains,
          rules: securityRules,
          references: securityReferences,
          details: securityDetails,
        });
        // END Security Table
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setIsIPTablesLoading(false);
      }
    },
    [getAllChainsAsJson],
  );

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  useEffect(() => {
    if (
      location.pathname ===
        `/dashboard/${params.connectionId}/security/iptables` &&
      !packages["security"].iptables.installed
    ) {
      navigate(-1);
    }
  }, [packages, location.pathname, params, navigate]);

  const IPTablesProviderValues = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      filterRules,
      natRules,
      mangleRules,
      rawRules,
      securityRules,
      isIPTablesLoading,
      setIsIPTablesLoading,
      fetchRules,
    }),
    [
      activeTab,
      filterRules,
      natRules,
      mangleRules,
      rawRules,
      securityRules,
      isIPTablesLoading,
      fetchRules,
    ],
  );

  return (
    <IPTablesContext.Provider value={IPTablesProviderValues}>
      {children}
    </IPTablesContext.Provider>
  );
}

IPTablesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IPTablesProvider;
