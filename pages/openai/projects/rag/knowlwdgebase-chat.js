import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import RagChatSidebar from "@/components/rag_chat/RagChatSidebar";
import RagChatingArea from "@/components/rag_chat/RagChatingArea";
import Swal from "sweetalert2"; // Make sure to import Swal

const ChatMainContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Show welcome toast after successful login
  // Updated section of your useEffect for the welcome toast
  useEffect(() => {
    if (session && !hasShownWelcomeToast) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        Swal.fire({
          title: "Welcome to Your AI Assistant! 🤖",
          html: `
          <div style="text-align: left; font-size: 16px; line-height: 1.6;">
            <p style="margin-bottom: 20px;"><strong>🚀 Here's how to get started:</strong></p>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; margin: 15px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 24px; margin-right: 12px;">📄</span>
                <div>
                  <strong>Upload & Chat with PDFs</strong>
                  <p style="margin: 5px 0 0 0; opacity: 0.9;">Upload PDFs in the sidebar and ask questions about their content</p>
                </div>
              </div>
           
              <div style="display: flex; align-items: center;">
                <span style="font-size: 24px; margin-right: 12px;">⚡</span>
                <div>
                  <strong>Smart Context Switching</strong>
                  <p style="margin: 5px 0 0 0; opacity: 0.9;">Seamlessly switch between PDF-based and general conversations</p>
                </div>
              </div>
            </div>
            <div style="background: rgba(255, 193, 7, 0.15); border: 2px solid rgba(255, 193, 7, 0.3); border-radius: 8px; padding: 15px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #ffd700; font-weight: 500;">
                💡 <strong>Pro Tip:</strong> Ask things like <em>"What does the latest company policy say about leave?"</em>
              </p>
            </div>
          </div>
        `,
          icon: "info",
          width: 600,
          padding: "2rem",
          showConfirmButton: true,
          confirmButtonText: "Perfect! Let's get started 🚀",
          confirmButtonColor: "#28a745", // Changed to green to distinguish from pro tip
          backdrop: `rgba(0,0,0,0.8)`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: false,
          customClass: {
            popup: "welcome-toast-popup",
            title: "welcome-toast-title",
            htmlContainer: "welcome-toast-content",
            confirmButton: "welcome-toast-button",
          },
          didOpen: () => {
            // Add custom styles
            const style = document.createElement("style");
            style.textContent = `
            .welcome-toast-popup {
              box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
          
            }
            .welcome-toast-title {
              color: white !important;
              font-size: 28px !important;
              font-weight: 700 !important;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
            }
            .welcome-toast-content {
              color: white !important;
            }
            .welcome-toast-content ul {
              text-align: left !important;
            }
            .welcome-toast-content li {
              margin: 8px 0 !important;
            }
            .welcome-toast-button {
              font-weight: 600 !important;
              padding: 15px 35px !important;
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
              border: 2px solid rgba(255, 255, 255, 0.2) !important;
              border-radius: 50px !important;
              box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4) !important;
              transition: all 0.3s ease !important;
              font-size: 16px !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
            }
            .welcome-toast-button:hover {
              transform: translateY(-3px) !important;
              box-shadow: 0 8px 25px rgba(40, 167, 69, 0.6) !important;
              background: linear-gradient(135deg, #218838 0%, #1abc9c 100%) !important;
            }
            .welcome-toast-button:active {
              transform: translateY(-1px) !important;
            }
          `;
            document.head.appendChild(style);
          },
        });
        setHasShownWelcomeToast(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [session, hasShownWelcomeToast]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>AI Projects - Chatbot</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>
      <div className="main-content">
        <div className="chatting-panel">
          <div className="d-flex">
            <div className="">
              <div className="panel-body border-bottom panelbody-openai"></div>
            </div>

            <div className="panel position-relative bedrock-custom-panel">
              <RagChatingArea />
            </div>
            <RagChatSidebar />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ChatMainContent;
