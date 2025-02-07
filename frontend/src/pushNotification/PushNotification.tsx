import { useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Notification {
  id: string;
  playerId: string;
  content: string;
  sentCount: string;
}

const PushNotification = () => {

  const addNotification = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/notification/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'New notification content',
          playerId: '300',
          sentCount: 1
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  useEffect(() => {
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
            const playerId = payload.playerId || "Unknown player ID";

            // Show notification only if playerId equals 300
            if (playerId === "300") {
              const notificationRow: Notification = {
                id: payload.id,
                playerId: playerId,
                content: content,
                sentCount: sentCount,
              };

              notificationsQueue.push(notificationRow);

              if (notificationsQueue.length === 1) {
                processNotifications();
              }
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
            "bg-blue-500 text-white p-4 rounded-lg shadow-lg min-w-[200px] max-w-[300px] animate-slide-in break-words";

          notificationDiv.innerHTML = `<p class="text-xl whitespace-pre-wrap break-words">${currentNotification.content}</p>`;

          const container = document.getElementById("notifications-container");

          if (container) {
            container.appendChild(notificationDiv);

            setTimeout(() => {
              notificationDiv.classList.add("animate-marquee");
            }, 2000);

            setTimeout(() => {
              container.removeChild(notificationDiv);
              processNotifications();
            }, 5500);
          }
        }
      }
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, []);

  return (
    <div>
      {/* Notification Container */}
      <div
        id="notifications-container"
        className="fixed top-16 left-0 right-0 m-4 p-4 bg-gray-400 bg-opacity-50 rounded-lg border border-gray-700 shadow-lg flex flex-col space-y-2 min-h-[70px] items-end"
      >
        {/* Notifications will appear here */}
      </div>

      {/* Styles */}
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
