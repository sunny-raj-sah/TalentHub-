 
const AIChatInterface = ({
  assistantName,
  description,
  messages = [],
  input,
  onInputChange,
  onSend,
  onClear,
  isLoading = false,
  error = null,
  suggestions = [],
  onSuggestionClick,
  disabled = false,
  disabledMessage = "Select a job to start your conversation.",
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim() || isLoading || disabled) return;

    onSend();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="card shadow-sm h-100">
      {/* Chat Header */}
      <div className="card-header bg-white p-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="bi bi-robot fs-4"></i>
            </div>

            <div>
              <h5 className="mb-1">{assistantName}</h5>
              <p className="text-muted small mb-0">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm flex-shrink-0"
            onClick={onClear}
            disabled={disabled || isLoading || messages.length === 0}
            title="Clear current conversation"
          >
            <i className="bi bi-trash me-1"></i>
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="card-body p-3"
       style={{
  height: "clamp(480px, 65vh, 720px)",
  overflowY: "auto",
  backgroundColor: "#f8f9fa",
}}
      >
        {disabled ? (
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <i className="bi bi-briefcase fs-1 text-secondary mb-3"></i>
            <h6>Select a job first</h6>
            <p className="text-muted small mb-0">
              {disabledMessage}
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <i className="bi bi-chat-square-text fs-1 text-primary mb-3"></i>

            <h6>Start a conversation</h6>

            <p className="text-muted small">
              Ask a question or choose one of the suggestions below.
            </p>

            {suggestions.length > 0 && (
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onSuggestionClick?.(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id || index}
                  className={`d-flex ${
                    isUser ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-3 ${
                      isUser
                        ? "bg-primary text-white"
                        : "bg-white border"
                    }`}
                    style={{
                      maxWidth: "85%",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <div className="small fw-semibold mb-2">
                      {isUser ? "You" : assistantName}
                    </div>

                    <div>{message.content}</div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="d-flex justify-content-start">
                <div className="bg-white border rounded-3 p-3">
                  <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                  <span className="text-muted small">
                    Generating response...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-3 pt-2">
          <div className="alert alert-danger py-2 mb-0 small">
            {error}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="card-footer bg-white p-3">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <textarea
              className="form-control"
              rows="2"
              placeholder={
                disabled
                  ? "Select a job to start..."
                  : "Type your question..."
              }
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading}
              maxLength={2000}
            />

            <button
              type="submit"
              className="btn btn-primary px-3"
              disabled={
                disabled || isLoading || !input.trim()
              }
              title="Send message"
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <i className="bi bi-send-fill"></i>
              )}
            </button>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted">
              Enter to send · Shift + Enter for a new line
            </small>

            <small className="text-muted">
              {input.length}/2000
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChatInterface;
