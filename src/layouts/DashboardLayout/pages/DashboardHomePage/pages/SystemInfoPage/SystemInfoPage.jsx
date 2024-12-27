import { useEffect, useState } from "react";
import "./SystemInfoPage.scss";
import { motion } from "framer-motion";
import BreadCrumbs from "../../../../../../components/BreadCrumbs/BreadCrumbs";

function SystemInfoPage() {
  const [systemInfo, setSystemInfo] = useState({
    pcName: "",
    systemDetails: {
      os: "",
      hostname: "",
      kernel: "",
      distro: "",
      version: "",
      arch: "",
    },
    uptime: "",
    tasks: {
      total: "",
      running: "",
      sleeping: "",
      stopped: "",
      zombie: "",
    },
    cpu: {
      name: "",
      cores: "",
      speed: "",
    },
    memory: {
      total: "",
      used: "",
      free: "",
    },
    disk: {
      total: "",
      used: "",
      free: "",
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      setLoading(true);

      const executeCommand = async (command) => {
        const result = await window.Electron.ssh.executeCommand(command);
        return result.output || "";
      };

      // System Details
      const unameResult = await executeCommand("uname -a");
      const [
        os,
        hostname,
        kernel,
        build,
        smp,
        preempt,
        distro,
        version,
        date,
        arch,
      ] = unameResult.split(" ");

      // Tasks
      const tasksResult = await executeCommand(
        "top -bn1 | grep 'Tasks' | awk '{print $2,$4,$6,$8,$10}'",
      );
      const [total, running, sleeping, stopped, zombie] =
        tasksResult.split(" ");

      const allInfo = {
        pcName: hostname,
        systemDetails: {
          os,
          hostname,
          kernel,
          build,
          smp,
          preempt,
          distro,
          version,
          date,
          arch,
        },
        uptime: await executeCommand("uptime -p"),
        tasks: {
          total,
          running,
          sleeping,
          stopped,
          zombie,
        },
        cpu: {
          name: await executeCommand(
            "lscpu | grep 'Model name' | awk -F: '{print $2}'",
          ),
          cores: await executeCommand(
            "lscpu | grep '^CPU(s):' | awk -F: '{print $2}'",
          ),
          speed: await executeCommand(
            "grep 'cpu MHz' /proc/cpuinfo | head -1 | awk '{print $4}'",
          ).then((speed) => {
            const ghz = (parseFloat(speed) / 1000).toFixed(2);
            return `${ghz} GHz`;
          }),
        },
        memory: {
          total: await executeCommand("free -m | awk 'NR==2{print $2}'"),
          used: await executeCommand("free -m | awk 'NR==2{print $3}'"),
          free: await executeCommand("free -m | awk 'NR==2{print $4}'"),
        },
        disk: {
          total: await executeCommand("df -h | awk '$NF==\"/\"{print $2}'"),
          used: await executeCommand("df -h | awk '$NF==\"/\"{print $3}'"),
          free: await executeCommand("df -h | awk '$NF==\"/\"{print $4}'"),
        },
      };

      setSystemInfo(allInfo);
      setLoading(false);
    };

    fetchSystemInfo();
  }, []);

  if (loading) {
    return (
      <div className='dashboard-layout-page column'>
        <BreadCrumbs />
        <div className='system-info-page column gap10'>
          <div className='box-container noborder'>
            <div className='grid4'>
              <motion.fieldset
                className='box column gap5'
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <legend className='title yellow-title'>System Details</legend>
                <div className='content column aic jcc gap25'>
                  <div className='loading-spinner' />
                  <p>Loading OS info...</p>
                </div>
              </motion.fieldset>

              <motion.div
                className='column gap10'
                initial={{ opacity: 0, y: 25 * 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5 * 2,
                  ease: "easeOut",
                }}
              >
                <fieldset className='box column flex1 gap5'>
                  <legend className='title yellow-title'>Memory</legend>
                  <div className='content column aic jcc gap25'>
                    <div className='loading-spinner' />
                    <p>Loading memory info...</p>
                  </div>
                </fieldset>

                <fieldset className='box column flex1 gap5'>
                  <legend className='title yellow-title'>Disk</legend>
                  <div className='content column aic jcc gap25'>
                    <div className='loading-spinner' />
                    <p>Loading disk info...</p>
                  </div>
                </fieldset>
              </motion.div>

              <motion.fieldset
                className='box grid-col-2 column gap5'
                initial={{ opacity: 0, y: 25 * 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5 * 3,
                  ease: "easeOut",
                }}
              >
                <legend className='title yellow-title'>CPU</legend>
                <div className='content column aic jcc gap25'>
                  <div className='loading-spinner' />
                  <p>Loading CPU info...</p>
                </div>
              </motion.fieldset>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-layout-page column'>
      <BreadCrumbs />
      <div className='system-info-page column gap10'>
        <div className='box-container noborder'>
          <div className='grid4'>
            <fieldset className='box column gap5'>
              <legend className='title yellow-title'>System Details</legend>
              <div className='content column gap15'>
                <fieldset>
                  <legend>PC Name</legend>
                  <span>{systemInfo?.pcName}</span>
                </fieldset>
                <fieldset>
                  <legend>OS</legend>
                  <span>{systemInfo?.systemDetails.os}</span>
                </fieldset>
                <fieldset>
                  <legend>Kernel</legend>
                  <span>{systemInfo?.systemDetails.kernel}</span>
                </fieldset>
                <fieldset>
                  <legend>Distro</legend>
                  <span>{systemInfo?.systemDetails.distro}</span>
                </fieldset>
                <fieldset>
                  <legend>Version</legend>
                  <span>{systemInfo?.systemDetails.version}</span>
                </fieldset>
                <fieldset>
                  <legend>Arch</legend>
                  <span>{systemInfo?.systemDetails.arch}</span>
                </fieldset>
              </div>
            </fieldset>

            <div className='column gap10'>
              <fieldset className='box column flex1 gap5'>
                <legend className='title yellow-title'>Memory</legend>
                <div className='content column gap15'>
                  <fieldset>
                    <legend>Total</legend>
                    <span>{systemInfo?.memory.total} MB</span>
                  </fieldset>
                  <fieldset>
                    <legend>Used</legend>
                    <span>{systemInfo?.memory.used} MB</span>
                  </fieldset>
                  <fieldset>
                    <legend>Free</legend>
                    <span>{systemInfo?.memory.free} MB</span>
                  </fieldset>
                </div>
              </fieldset>

              <fieldset className='box column flex1 gap5'>
                <legend className='title yellow-title'>Disk</legend>
                <div className='content column gap15'>
                  <fieldset>
                    <legend>Total</legend>
                    <span>{systemInfo?.disk.total} MB</span>
                  </fieldset>
                  <fieldset>
                    <legend>Used</legend>
                    <span>{systemInfo?.disk.used} MB</span>
                  </fieldset>
                  <fieldset>
                    <legend>Free</legend>
                    <span>{systemInfo?.disk.free} MB</span>
                  </fieldset>
                </div>
              </fieldset>
            </div>

            <fieldset className='box grid-col-2 column gap5'>
              <legend className='title yellow-title'>CPU</legend>
              <div className='content column gap15'>
                <fieldset>
                  <legend>Name</legend>
                  <span>{systemInfo?.cpu.name}</span>
                </fieldset>
                <fieldset>
                  <legend>Cores</legend>
                  <span>{systemInfo?.cpu.cores}</span>
                </fieldset>
                <fieldset>
                  <legend>Speed</legend>
                  <span>{systemInfo?.cpu.speed}</span>
                </fieldset>
                <fieldset>
                  <legend>Uptime</legend>
                  <span>{systemInfo?.uptime}</span>
                </fieldset>
                <fieldset>
                  <legend>Tasks</legend>
                  <div className='column gap5'>
                    <span>Total: {systemInfo?.tasks.total} </span>
                    <span>Running: {systemInfo?.tasks.running} </span>
                    <span>Sleeping: {systemInfo?.tasks.sleeping} </span>
                    <span>Stopped: {systemInfo?.tasks.stopped} </span>
                    <span>Zombie: {systemInfo?.tasks.zombie} </span>
                  </div>
                </fieldset>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemInfoPage;
