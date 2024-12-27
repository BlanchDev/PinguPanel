import { useIPTables } from "../../context/IPTablesContext";

function NatTable() {
  const { natRules } = useIPTables();

  return (
    <div className='nat-table w100 column'>
      <div className='box-container noborder column gap10'>
        <div className='box column gap10'>
          <h2 className='yellow-title'>Docker NAT Rules</h2>
          <div className='table-container column gap10'>
            <div className='content column gap10'>
              <div className='rule-container'>
                <div className='rule-content'>
                  <code>
                    num pkts bytes target prot opt in out source destination
                  </code>
                </div>
              </div>
              {natRules.docker.map((rule, index) => (
                <div key={rule + index} className='rule-container'>
                  <div className='rule-content'>
                    <code>{rule}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='box-container noborder column gap10'>
        <div className='box column gap10'>
          <h2 className='yellow-title'>Other NAT Rules</h2>
          <div className='table-container column gap10'>
            <div className='content column gap10'>
              {natRules.other.map((rule, index) => (
                <div key={rule + index} className='rule-container'>
                  <div className='rule-content'>
                    <code>{rule}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NatTable;
