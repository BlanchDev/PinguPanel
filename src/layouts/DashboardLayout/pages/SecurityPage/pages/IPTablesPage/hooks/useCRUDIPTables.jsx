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

  return {
    handleMoveRule,
    handleCreateRule,
    handleDeleteRule,
    handleDeleteChain,
  };
}

export default useCRUDIPTables;
