import { Analytics } from "@vercel/analytics/react";
import { Home } from "./components/home";
import { getServerSideConfig } from "./config/server";
import { useEffect } from "react";
import { useAppConfig } from "./store/config";

const serverConfig = getServerSideConfig();

export default async function App() {
  const appConfig = useAppConfig();

  const handleMessage = (event) => {
    // 确保消息来自信任的源
    if (!event.origin.includes("omeoffice")) {
      console.log("not found");
      return; // 如果不是信任的源，忽略消息
    }

    // 处理消息
    if (event.data.param2 !== null || event.data.param2 !== undefined)
      appConfig.setOmeMetis(event.data.param2);
    console.log("Received message from parent:", event.data.param2);
  };

  useEffect(() => {
    window.parent.postMessage("omemetis is ready", "*");

    // 添加事件监听器
    window.addEventListener("message", handleMessage);

    // 清理事件监听器：组件卸载时移除事件监听
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Home />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
