import streamlit as st
import time

st.set_page_config(page_title="Enterprise RAG Chatbot", page_icon="🤖", layout="wide")

# Sidebar
with st.sidebar:
    st.title("⚙️ AI Settings")
    st.markdown("Configure your AI Agent")
    api_key = st.text_input("OpenAI API Key (Optional for Demo)", type="password", help="Enter your Open AI secret key")
    uploaded_file = st.file_uploader("Upload Knowledge Base (PDF)", type="pdf")
    
    st.divider()
    st.markdown("### Database Status")
    if uploaded_file:
        st.success("Vector Embeddings: Indexed ✓")
    else:
        st.warning("Store is empty. Please upload.")
    
# Main UI
st.title("Enterprise RAG Assistant 🧠")
st.markdown("Retrieval-Augmented Generation (RAG) system for secure corporate data querying.")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []
    # Add initial greeting
    st.session_state.messages.append({"role": "assistant", "content": "Hello! I am your AI assistant connected to your private knowledge base. Please upload a PDF on the left and ask me a question."})

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# React to user input
if prompt := st.chat_input("E.g., Summarize the financial Q3 report..."):
    # Display user message in chat message container
    st.chat_message("user").markdown(prompt)
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # AI Response
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        
        if not uploaded_file:
            full_response = "⚠️ **Warning:** Please upload a PDF document in the sidebar to generate context for my answers."
        else:
            # Simulated response for portfolio screenshots
            simulated_response = (
                "**[Context Retrieved from Vector DB]**\n\n"
                f"Analyzing internal document references related to: *{prompt}*...\n\n"
                "Based on section 4 of the uploaded knowledge base, the operating margins increased by **14%** year-over-year. "
                "Furthermore, the semantic search indicates that new client acquisition is the main driver of this growth.\n\n"
                "*Confidence Score: 0.92 | Source: page_4.pdf*"
            )
            for chunk in simulated_response.split(" "):
                full_response += chunk + " "
                time.sleep(0.04)
                message_placeholder.markdown(full_response + "▌")
                
        message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})
