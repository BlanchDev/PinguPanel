import upArrow from "../../../../../../../assets/tools/up-arrow.png";
import downArrow from "../../../../../../../assets/tools/down-arrow.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useCRUDIPTables from "./useCRUDIPTables";
import AreYouSureModal from "../../../../../../../components/modals/AreYouSureModal/AreYouSureModal";

function useRenderIPTablesTable(tableType, tableRules) {
  const [moveLoading, setMoveLoading] = useState(false);

  const [deleteRuleModal, setDeleteRuleModal] = useState(false);

  const { handleMoveRule, handleDeleteRule } = useCRUDIPTables();

  const renderMoveRule = (
    chainName,
    rule,
    ruleNumber,
    isFirstRule,
    isLastRule,
  ) => {
    const desiredIndexMoveUp = ruleNumber - 1;
    const desiredIndexMoveDown = ruleNumber + 1;

    return (
      <div className='move-rule-buttons row aic gap10'>
        <button
          className='move-rule-button'
          onClick={() => {
            setMoveLoading(true);
            handleMoveRule(
              tableType,
              chainName,
              rule,
              ruleNumber,
              desiredIndexMoveUp,
            ).finally(() => {
              setMoveLoading(false);
            });
          }}
          disabled={isFirstRule === rule || moveLoading}
        >
          <img src={upArrow} alt='Up' />
        </button>
        <button
          className='move-rule-button'
          onClick={() => {
            setMoveLoading(true);
            handleMoveRule(
              tableType,
              chainName,
              rule,
              ruleNumber,
              desiredIndexMoveDown,
            ).finally(() => {
              setMoveLoading(false);
            });
          }}
          disabled={isLastRule === rule || moveLoading}
        >
          <img src={downArrow} alt='Down' />
        </button>
      </div>
    );
  };

  const renderRules = (rules, policyName) => {
    const isFirstRule = rules[0];
    const isLastRule = rules[rules.length - 1];

    return rules.map((rule, index) => {
      const ruleNumber = index + 1;

      return (
        <motion.div
          key={rule + policyName + "rule" + index}
          className='rule-container row aic gap10'
          layout
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 500,
            damping: 50,
          }}
        >
          {renderMoveRule(
            policyName,
            rule,
            ruleNumber,
            isFirstRule,
            isLastRule,
          )}
          <div className='rule-content border row aic jcsb gap10'>
            <div className='row aic gap10'>
              <span>{ruleNumber})</span> <code>{rule}</code>
            </div>
            <div className='row aic gap10'>
              <button
                className='button red'
                onClick={() => {
                  setDeleteRuleModal({
                    chainName: policyName,
                    ruleNumber,
                    rule,
                  });
                }}
              >
                Delete {ruleNumber})
              </button>
            </div>
          </div>
          {deleteRuleModal?.chainName === policyName &&
            deleteRuleModal?.ruleNumber === ruleNumber && (
              <AreYouSureModal
                modalClose={() => setDeleteRuleModal(false)}
                title={`Delete Rule | ${deleteRuleModal.chainName}`}
                description={`Are you sure you want to delete rule "${deleteRuleModal.ruleNumber})"? \n\n ${deleteRuleModal.rule}`}
                buttonText='Delete Rule'
                handleConfirm={async () => {
                  try {
                    await handleDeleteRule(
                      tableType,
                      deleteRuleModal.chainName,
                      deleteRuleModal.ruleNumber,
                    );
                    setDeleteRuleModal(false);
                  } catch (error) {
                    toast.error(
                      `An error occurred while deleting rule: ${error.message}`,
                    );
                  }
                }}
              />
            )}
        </motion.div>
      );
    });
  };

  const sortChains = (chains, policyName) => {
    return chains.sort((a, b) => {
      if (policyName === "INPUT") {
        const inputRules = tableRules.rules
          .filter((rule) => rule.startsWith("-A INPUT"))
          .map((rule) => rule.split(" -j ")[1]);

        const indexA = inputRules.indexOf(a.name);
        const indexB = inputRules.indexOf(b.name);

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      }

      return a.orderInInput - b.orderInInput;
    });
  };

  const renderChains = (chains, policyName) => {
    const filteredChains = chains.filter((chain) =>
      chain.parents.some((parent) => parent.name === policyName),
    );

    const sortedChains = sortChains(filteredChains, policyName);

    return sortedChains.map((chain) => (
      <li key={chain.name} className='chain-item'>
        {chain.name}
        <ol className='sub-chains'>{renderSubChains(chain.name)}</ol>
      </li>
    ));
  };

  const sortSubChains = (subChains, chainName) => {
    return subChains.sort((a, b) => {
      const parentRules = tableRules.rules
        .filter((rule) => rule.startsWith(`-A ${chainName}`))
        .map((rule) => rule.split(" -j ")[1]);

      const indexA = parentRules.indexOf(a.name);
      const indexB = parentRules.indexOf(b.name);

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  };

  const renderSubChains = (chainName) => {
    const subChains = tableRules.details.chains.filter((subChain) =>
      subChain.parents.some((parent) => parent.name === chainName),
    );

    const sortedSubChains = sortSubChains(subChains, chainName);

    return sortedSubChains.map((subChain) => (
      <li key={subChain.name}>{subChain.name}</li>
    ));
  };

  const getUniqueChainItems = (chain, type) => {
    return chain[type].filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );
  };

  const renderCustomChainDetails = (chainName, type) => {
    const matchingChains = tableRules.details.chains.filter(
      (chain) => chain.name === chainName,
    );

    return matchingChains.flatMap((chain) => {
      const uniqueItems = getUniqueChainItems(chain, type);
      return uniqueItems.map((item, index) => (
        <p key={`${item.name}${chainName}${type}${index}`}>{item.name}</p>
      ));
    });
  };

  const renderCustomChainRules = (chainName) => {
    const chain = tableRules.details.chains.find(
      (chain) => chain.name === chainName,
    );

    if (!chain) return null;

    const isFirstRule = chain.rules[0]?.rule;
    const isLastRule = chain.rules[chain.rules.length - 1]?.rule;

    return chain.rules.map((rule, index) => {
      const ruleNumber = index + 1;

      return (
        <motion.div
          key={`${rule.rule}-${chainName}-${index}`}
          className='rule-container row aic gap10'
          layout
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 500,
            damping: 50,
          }}
        >
          {renderMoveRule(
            chainName,
            rule.rule,
            ruleNumber,
            isFirstRule,
            isLastRule,
          )}
          <div className='rule-content border row aic jcsb gap10'>
            <div className='row aic gap10'>
              <span>{ruleNumber})</span> <code>{rule.rule}</code>
            </div>
            <div className='row aic gap10'>
              <button
                className='button red'
                onClick={() =>
                  setDeleteRuleModal({
                    chainName,
                    ruleNumber,
                    rule: rule.rule,
                  })
                }
              >
                Delete {ruleNumber})
              </button>
            </div>
          </div>
          {deleteRuleModal?.chainName === chainName &&
            deleteRuleModal?.ruleNumber === ruleNumber && (
              <AreYouSureModal
                modalClose={() => setDeleteRuleModal(false)}
                title={`Delete Rule | ${deleteRuleModal.chainName}`}
                description={`Are you sure you want to delete rule "${deleteRuleModal.ruleNumber})"? \n\n ${deleteRuleModal.rule}`}
                buttonText='Delete Rule'
                handleConfirm={async () => {
                  try {
                    await handleDeleteRule(
                      tableType,
                      deleteRuleModal.chainName,
                      deleteRuleModal.ruleNumber,
                    );
                    setDeleteRuleModal(false);
                  } catch (error) {
                    toast.error(
                      `An error occurred while deleting rule: ${error.message}`,
                    );
                  }
                }}
              />
            )}
        </motion.div>
      );
    });
  };

  return {
    renderRules,
    renderChains,
    renderCustomChainDetails,
    renderCustomChainRules,
  };
}

export default useRenderIPTablesTable;
