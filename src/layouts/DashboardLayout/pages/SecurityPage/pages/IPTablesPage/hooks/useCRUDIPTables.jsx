import { toast } from "react-toastify";
import { useIPTables } from "../context/IPTablesContext";

function useCRUDIPTables() {
  const { fetchRules } = useIPTables();

  const handleMoveRule = async (
    tableType,
    chain,
    rule,
    ruleNumber,
    desiredIndex,
  ) => {
    let deleteRuleCommand;

    switch (tableType) {
      case "filter":
        deleteRuleCommand = `iptables -D ${chain} ${ruleNumber}`;
        break;

      case "nat":
        deleteRuleCommand = `iptables -t nat -D ${chain} ${ruleNumber}`;
        break;

      case "mangle":
        deleteRuleCommand = `iptables -t mangle -D ${chain} ${ruleNumber}`;
        break;

      case "raw":
        deleteRuleCommand = `iptables -t raw -D ${chain} ${ruleNumber}`;
        break;

      case "security":
        deleteRuleCommand = `iptables -t security -D ${chain} ${ruleNumber}`;
        break;

      default:
        return false;
    }

    try {
      const deleteResult = await window.Electron.ssh.executeCommand(
        deleteRuleCommand,
      );

      if (!deleteResult.success || deleteResult.output.length > 1) {
        toast.error(deleteResult.output);
        return false;
      }

      const pureRule = rule.split(chain)[1];

      let insertRuleCommand;

      switch (tableType) {
        case "filter":
          insertRuleCommand = `iptables -I ${chain} ${desiredIndex} ${pureRule}`;
          break;

        case "nat":
          insertRuleCommand = `iptables -t nat -I ${chain} ${desiredIndex} ${pureRule}`;
          break;

        case "mangle":
          insertRuleCommand = `iptables -t mangle -I ${chain} ${desiredIndex} ${pureRule}`;
          break;

        case "raw":
          insertRuleCommand = `iptables -t raw -I ${chain} ${desiredIndex} ${pureRule}`;
          break;

        case "security":
          insertRuleCommand = `iptables -t security -I ${chain} ${desiredIndex} ${pureRule}`;
          break;

        default:
          return false;
      }

      const insertResult = await window.Electron.ssh.executeCommand(
        insertRuleCommand,
      );

      if (!insertResult.success || insertResult.output.length > 1) {
        toast.error(insertResult.output);
        return false;
      }

      const noLoading = false;
      await fetchRules(noLoading);

      if (desiredIndex === ruleNumber - 1) {
        toast.success("Rule moved up successfully");
      } else {
        toast.success("Rule moved down successfully");
      }

      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleCreateRule = async (tableType, ruleCommand) => {
    let createRuleCommand;

    switch (tableType) {
      case "filter":
        createRuleCommand = `iptables ${ruleCommand}`;
        break;

      case "nat":
        createRuleCommand = `iptables -t nat ${ruleCommand}`;
        break;

      case "mangle":
        createRuleCommand = `iptables -t mangle ${ruleCommand}`;
        break;

      case "raw":
        createRuleCommand = `iptables -t raw ${ruleCommand}`;
        break;

      case "security":
        createRuleCommand = `iptables -t security ${ruleCommand}`;
        break;

      default:
        return false;
    }

    try {
      const result = await window.Electron.ssh.executeCommand(
        createRuleCommand,
      );

      if (!result.success || result.output.length > 1) {
        toast.error(result.output.split("\n")[0]);
        return false;
      }

      const noLoading = false;
      await fetchRules(noLoading);

      toast.success("Rule added successfully!");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleDeleteRule = async (tableType, chain, ruleNumber) => {
    let deleteRuleCommand;

    switch (tableType) {
      case "filter":
        deleteRuleCommand = `iptables -D ${chain} ${ruleNumber}`;
        break;

      case "nat":
        deleteRuleCommand = `iptables -t nat -D ${chain} ${ruleNumber}`;
        break;

      case "mangle":
        deleteRuleCommand = `iptables -t mangle -D ${chain} ${ruleNumber}`;
        break;

      case "raw":
        deleteRuleCommand = `iptables -t raw -D ${chain} ${ruleNumber}`;
        break;

      case "security":
        deleteRuleCommand = `iptables -t security -D ${chain} ${ruleNumber}`;
        break;

      default:
        return false;
    }

    try {
      const result = await window.Electron.ssh.executeCommand(
        deleteRuleCommand,
      );

      if (!result.success || result.output.length > 1) {
        toast.error(result.output);
        return false;
      }

      const noLoading = false;
      await fetchRules(noLoading);

      toast.success("Rule deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleDeleteChain = async (tableType, chainName) => {
    let deleteChainCommand;

    switch (tableType) {
      case "filter":
        deleteChainCommand = `
        iptables -F ${chainName}
        iptables -X ${chainName}`;
        break;

      case "nat":
        deleteChainCommand = `
        iptables -t nat -F ${chainName}
        iptables -t nat -X ${chainName}`;
        break;

      case "mangle":
        deleteChainCommand = `
        iptables -t mangle -F ${chainName}
        iptables -t mangle -X ${chainName}`;
        break;

      case "raw":
        deleteChainCommand = `
        iptables -t raw -F ${chainName}
        iptables -t raw -X ${chainName}`;
        break;

      case "security":
        deleteChainCommand = `
        iptables -t security -F ${chainName}
        iptables -t security -X ${chainName}`;
        break;

      default:
        return false;
    }

    try {
      const deleteResult = await window.Electron.ssh.executeCommand(
        deleteChainCommand,
      );

      if (!deleteResult.success || deleteResult.output.length > 1) {
        toast.error(deleteResult.output);
        return false;
      }

      const noLoading = false;
      await fetchRules(noLoading);

      toast.success("Chain deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleChangePolicyType = async (tableType, chainName, policyType) => {
    let changePolicyTypeCommand;

    switch (tableType) {
      case "filter":
        changePolicyTypeCommand = `iptables -P ${chainName} ${policyType}`;
        break;

      case "nat":
        changePolicyTypeCommand = `iptables -t nat -P ${chainName} ${policyType}`;
        break;

      case "mangle":
        changePolicyTypeCommand = `iptables -t mangle -P ${chainName} ${policyType}`;
        break;

      case "raw":
        changePolicyTypeCommand = `iptables -t raw -P ${chainName} ${policyType}`;
        break;

      case "security":
        changePolicyTypeCommand = `iptables -t security -P ${chainName} ${policyType}`;
        break;

      default:
        return false;
    }

    try {
      const result = await window.Electron.ssh.executeCommand(
        changePolicyTypeCommand,
      );

      if (!result.success || result.output.length > 1) {
        toast.error(result.output.split("\n")[0]);
        return false;
      }

      const noLoading = false;
      await fetchRules(noLoading);

      toast.success("Policy type changed successfully!");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    handleMoveRule,
    handleCreateRule,
    handleDeleteRule,
    handleDeleteChain,
    handleChangePolicyType,
  };
}

export default useCRUDIPTables;
