import { toast } from "react-toastify";
import { useIPTables } from "../../../context/IPTablesContext";

function useCRUDFilterTable() {
  const { fetchRules } = useIPTables();

  const handleMoveRule = async (chain, rule, ruleNumber, desiredIndex) => {
    try {
      const deleteResult = await window.Electron.ssh.executeCommand(
        `iptables -D ${chain} ${ruleNumber}`,
      );

      if (!deleteResult.success) {
        throw new Error(deleteResult.output);
      }

      const pureRule = rule.split(chain)[1];

      const insertResult = await window.Electron.ssh.executeCommand(
        `iptables -I ${chain} ${desiredIndex} ${pureRule}`,
      );

      if (!insertResult.success) {
        throw new Error(insertResult.output);
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
      throw new Error(err.message);
    }
  };

  const handleDeleteRule = async (chain, ruleNumber) => {
    try {
      const result = await window.Electron.ssh.executeCommand(
        `iptables -D ${chain} ${ruleNumber}`,
      );

      if (
        !result.success ||
        result.output.includes("-h") ||
        result.output.includes("help")
      ) {
        throw new Error(result.output.split("\n")[0]);
      }

      const noLoading = false;
      await fetchRules(noLoading);

      toast.success("Rule deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      throw new Error(err.message);
    }
  };

  const handleCreateRule = async (ruleCommand) => {
    try {
      const result = await window.Electron.ssh.executeCommand(
        `iptables ${ruleCommand}`,
      );

      if (
        !result.success ||
        result.output.includes("-h") ||
        result.output.includes("help")
      ) {
        throw new Error(result.output.split("\n")[0]);
      }

      const noLoading = false;
      await fetchRules(noLoading);

      toast.success("Rule added successfully!");
      return true;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  return {
    handleMoveRule,
    handleDeleteRule,
    handleCreateRule,
  };
}

export default useCRUDFilterTable;
