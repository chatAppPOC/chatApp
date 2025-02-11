import { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Notification {
  id: string;
  playerId: string;
  content: string;
  sentCount: string;
}

const PushNotification = () => {
  const [isPlayerIdMatch,setisPlayerIdMatch] = useState (false);
  useEffect(() => {
    const storePlayerId = localStorage.getItem("id");

    if(storePlayerId != null){
      setisPlayerIdMatch(true);
    let stompClient: any;
    const notificationsQueue: Notification[] = [];

    const initializeWebSocket = async () => {
      try {
        const socketUrl = "http://localhost:8080/ws";
        const socket = new SockJS(socketUrl);
        stompClient = Stomp.over(socket);
console.log("intilizaing web socket",initializeWebSocket);

        // Connect to WebSocket using Bearer token in the headers
        stompClient.connect({ Authorization: "Basic YWRtaW5AdGVzdC5jb206YWRtaW4xMjM=" }, (frame: any) => {
          console.log("Connected to WebSocket", frame);

          // Subscribe to topic for notifications
          stompClient.subscribe("/topic/notifications", (notification: any) => {
            const payload = JSON.parse(notification.body);
            const content = payload.content || "No message content";
            const sentCount = payload.sentCount || "No count";
            const rplayerId = payload.playerId || "Unknown player ID";

            // Show notification only if playerId equals 300
              const notificationRow: Notification = {
                id: payload.id,
                playerId: rplayerId,
                content: content,
                sentCount: sentCount,
              };

              notificationsQueue.push(notificationRow);

              if (notificationsQueue.length === 1) {
                processNotifications();
              }
          });
        }, (error: any) => {
          console.error("Error connecting to WebSocket:", error);
        });
      } catch (error) {
        console.error("Failed to authenticate and initialize WebSocket:", error);
      }
    };

    initializeWebSocket();

    function processNotifications() {
      if (notificationsQueue.length > 0) {
        const currentNotification = notificationsQueue.shift();

        if (currentNotification) {
          // Create a new notification div
          const notificationDiv = document.createElement("div");
          notificationDiv.className =
            "bg-blue-500 text-white p-2 rounded-md shadow-md min-w-[180px] max-w-[200px] text-xs fixed top-8 right-4 animate-slide-in break-words";

          notificationDiv.innerHTML = `<p class="text-xl whitespace-pre-wrap break-words">${currentNotification.content}</p>`;
          document.body.appendChild(notificationDiv);
          const container = document.getElementById("notifications-container");


            setTimeout(() => {
              notificationDiv.classList.add("animate-marquee");
            }, 2000);

            setTimeout(() => {
              document.body.removeChild(notificationDiv);
              processNotifications();
            }, 5500);
        }
      }
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    }
  }else{
    setisPlayerIdMatch(false);
      }
  }, []);

  if(!isPlayerIdMatch){
    return null;
  }

  return (
    <div>
     
     
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100vw);
          }
        }

        .animate-slide-in {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-marquee {
          animation: marquee-left 5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PushNotification;
