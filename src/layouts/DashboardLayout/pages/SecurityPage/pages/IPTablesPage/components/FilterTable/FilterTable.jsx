import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import AreYouSureModal from "../../../../../../../../components/modals/AreYouSureModal/AreYouSureModal";
import { useIPTables } from "../../context/IPTablesContext";
import useCRUDIPTables from "../../hooks/useCRUDIPTables";
import useRenderIPTablesTable from "../../hooks/useRenderIPTablesTable";
import AddParentOrChildModal from "../../modals/AddParentOrChildModal";
import CreateRuleModal from "../../modals/CreateRuleModal";

function FilterTable() {
  //TODO: Filter rule structure

  //TODO: Create Are You Sure? Modal props: buttonText, message, onConfirm(work with FUNCTION), onCancel
  const [createRuleModal, setCreateRuleModal] = useState(false);
  const [addParentOrChildModal, setAddParentOrChildModal] = useState(false);
  const [deleteChainModal, setDeleteChainModal] = useState(false);

  const { filterRules } = useIPTables();

  const {
    renderRules,
    renderChains,
    renderCustomChainDetails,
    renderCustomChainRules,
  } = useRenderIPTablesTable("filter", filterRules);

  const { handleDeleteChain } = useCRUDIPTables();

  return (
    <div className='filter-table w100 maxContentH column gap50'>
      <div className='box-container noborder column gap10'>
        <div className='column gap25'>
          {filterRules.policies.map((policy, index) => {
            const policyName = policy.split(" ")[1];
            return (
              <div key={index + "basic-policy"} className='box column gap10'>
                <div className='row aic gap10'>
                  <h1 className='yellow-title'>{policyName}</h1>
                  <div className='content'>
                    <p>{policy}</p>
                  </div>
                </div>
                <div className='column gap25'>
                  <div className='table-container column gap5'>
                    <div className='row aic gap10'>
                      <h3 className='purple-title'>
                        Rules{" | "}
                        {
                          filterRules.rules.filter((rule) =>
                            rule.startsWith(`-A ${policyName}`),
                          ).length
                        }
                      </h3>
                      <button
                        className='button purple'
                        onClick={() =>
                          setCreateRuleModal({
                            ruleType: "A",
                            chainName: policyName,
                          })
                        }
                      >
                        Create Rule
                      </button>
                    </div>
                    <div className='content column gap10'>
                      {renderRules(
                        filterRules.rules.filter((rule) =>
                          rule.startsWith(`-A ${policyName}`),
                        ),
                        policyName,
                      )}
                    </div>
                  </div>
                  <div className='table-container column gap10'>
                    <div className='row aic gap10'>
                      <h3 className='purple-title'>
                        Chains{" | "}
                        {
                          filterRules.details.chains.filter((chain) =>
                            chain.parents.some(
                              (parent) => parent.name === policyName,
                            ),
                          ).length
                        }
                      </h3>
                    </div>
                    <ol className='content column gap10'>
                      {renderChains(filterRules.details.chains, policyName)}
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='box-container noborder column gap10'>
        <div className='row aic gap10'>
          <h2 className='title yellow-title'>
            Custom Chains{" | "}
            {filterRules.customChains.length}
          </h2>
          <button
            className='button yellow'
            onClick={() =>
              setCreateRuleModal({
                ruleType: "N",
              })
            }
          >
            Create New Chain
          </button>
        </div>
        <div className='column gap10'>
          {filterRules.customChains.map((chain) => {
            const chainName = chain.split(" ")[1];

            return (
              <motion.div
                key={chain + "custom-chain"}
                className='box column gap10'
                layout
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                }}
              >
                <div className='row aic gap10'>
                  <h3 className='orange-title'>{chainName}</h3>
                  <div className='content'>
                    <p>{chain}</p>
                  </div>
                  <button
                    className='button red'
                    onClick={() =>
                      setDeleteChainModal({
                        chainName,
                        chain,
                      })
                    }
                  >
                    Delete Chain: {chainName}
                  </button>
                </div>
                <div className='content column gap15'>
                  <div className='grid3'>
                    <div className='table-container column gap10'>
                      <div className='row aic gap10'>
                        <h5 className='purple-title'>
                          Parents{" | "}
                          {
                            filterRules.details.chains
                              .find((chain) => chain.name === chainName)
                              .parents.filter(
                                (parent, index, self) =>
                                  index ===
                                  self.findIndex((t) => t.name === parent.name),
                              ).length
                          }
                        </h5>
                        <button
                          className='button purple'
                          onClick={() =>
                            setAddParentOrChildModal({
                              target: "parent",
                              chainName,
                            })
                          }
                        >
                          Add Parent
                        </button>
                      </div>
                      <div className='content row gap10 wrap'>
                        {renderCustomChainDetails(chainName, "parents")}
                      </div>
                    </div>
                    <div className='table-container column gap10'>
                      <div className='row aic gap10'>
                        <h5 className='purple-title'>
                          Childrens{" | "}
                          {
                            filterRules.details.chains
                              .find((chain) => chain.name === chainName)
                              .children.filter(
                                (child, index, self) =>
                                  index ===
                                  self.findIndex((t) => t.name === child.name),
                              ).length
                          }
                        </h5>
                        <button
                          className='button purple'
                          onClick={() =>
                            setAddParentOrChildModal({
                              target: "child",
                              chainName,
                            })
                          }
                        >
                          Add Child
                        </button>
                      </div>
                      <div className='content row gap10 wrap'>
                        {renderCustomChainDetails(chainName, "children")}
                      </div>
                    </div>
                  </div>
                  <div className='table-container column gap10'>
                    <div className='row aic gap10'>
                      <h4 className='purple-title'>
                        Rules{" | "}
                        {
                          filterRules.rules.filter((rule) =>
                            rule.startsWith(`-A ${chainName}`),
                          ).length
                        }
                      </h4>
                      <button
                        className='button purple'
                        onClick={() =>
                          setCreateRuleModal({
                            ruleType: "A",
                            chainName,
                          })
                        }
                      >
                        Create Rule
                      </button>
                    </div>

                    <div className='content column gap10'>
                      {renderCustomChainRules(chainName)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Modals */}
      {createRuleModal && (
        <CreateRuleModal
          modalClose={() => setCreateRuleModal(false)}
          tableType='filter'
          ruleType={createRuleModal.ruleType}
          chainName={createRuleModal.chainName}
        />
      )}
      {addParentOrChildModal && (
        <AddParentOrChildModal
          modalClose={() => setAddParentOrChildModal(false)}
          tableType='filter'
          target={addParentOrChildModal.target}
          chainName={addParentOrChildModal.chainName}
        />
      )}
      {deleteChainModal && (
        <AreYouSureModal
          modalClose={() => setDeleteChainModal(false)}
          title={`Delete Chain: ${deleteChainModal.chainName}`}
          buttonText='Delete Chain'
          description={`Are you sure you want to delete this chain? \n\n iptables -F ${deleteChainModal.chainName} \n iptables -X ${deleteChainModal.chainName}`}
          handleConfirm={async () => {
            try {
              await handleDeleteChain("filter", deleteChainModal.chainName);
              setDeleteChainModal(false);
            } catch (error) {
              toast.error(error.message);
            }
          }}
        />
      )}
    </div>
  );
}

export default FilterTable;
