
const getStorageKey = (role, userId) =>
  `talenthub_ai_chat_${role}_${userId}`;

const getChatData = (role, userId) => {
  if (!userId) {
    return {
      selectedJobId: "",
      conversations: {},
    };
  }

  try {
    const storedData = localStorage.getItem(
      getStorageKey(role, userId)
    );

    return storedData
      ? JSON.parse(storedData)
      : {
          selectedJobId: "",
          conversations: {},
        };
  } catch {
    return {
      selectedJobId: "",
      conversations: {},
    };
  }
};

const saveChatData = (role, userId, data) => {
  if (!userId) return;

  localStorage.setItem(
    getStorageKey(role, userId),
    JSON.stringify(data)
  );
};

export const loadAIChat = (role, userId) => {
  return getChatData(role, userId);
};

export const saveSelectedAIJob = (
  role,
  userId,
  jobId
) => {
  const data = getChatData(role, userId);

  data.selectedJobId = jobId;

  saveChatData(role, userId, data);
};

export const saveAIConversation = (
  role,
  userId,
  jobId,
  messages
) => {
  if (!userId || !jobId) return;

  const data = getChatData(role, userId);

  if (messages.length > 0) {
    data.conversations[jobId] = messages;
  } else {
    delete data.conversations[jobId];
  }

  saveChatData(role, userId, data);
};

export const clearAIConversation = (
  role,
  userId,
  jobId
) => {
  if (!userId || !jobId) return;

  const data = getChatData(role, userId);

  delete data.conversations[jobId];

  saveChatData(role, userId, data);
};
