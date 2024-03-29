export const HEADERS = {
  USER_ID: "user-id",
  AUTHORIZATION: "authorization",
  RAZORPAY_SIGNATURE: "x-razorpay-signature",
};

export const USER_TYPES = {
  PROVIDER: "PROVIDER",
  CONSUMER: "CONSUMER",
  ADMIN: "ADMIN",
};

export const NOTIFICATION_EVENT_TYPES = {
  CALL: "CALL",
  EXAM: "EXAM",
};

export const SOCKET_EVENTS = {
  MESSAGE_SEND: "chat-message-send",
  MESSAGE_RECEIVED: "chat-message-received",
  DIRECT_MESSAGE_SEND: "chat-dm-send",
  DIRECT_MESSAGE_RECEIVED: "chat-dm-received",
  JOINED_CHAT: "joined-chat",
  LEFT_CHAT: "left-chat",
  GET_ONLINE_MEMBERS: "get-online-members",
  RECIEVED_ONLINE_MEMBER: "recieved-online-members",
};

export const USER_PICTURE_DEFAULT = "/tempuser.jpg";
export const COVER_PICTURE_DEFAULT = "/tempcover.jpg";

export const MODEL_INDEX = {
  PAGES: "pages",
  USERS: "users",
};

export const PAGE_TEMPLATES = ["SKY"];

export const ORDER_STATUS = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

export const PG_PAYMENT_STATUS = {
  CAPTURED: "captured",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const FORM_TYPES = {
  EXERCISE: "EXERCISE",
  SURVEY: "SURVEY",
  FEEDBACK: "FEEDBACK",
};

export const FORM_ENTITY_TYPES = {
  MCQ: "MCQ",
  SHORT: "SHORT",
  LONG: "LONG",
  FILE: "FILE",
};

export const CALENDER_EVENT_TYPES = {
  CALL: "CALL",
};

export const CALENDER_EVENT_SLOT_TYPES = {
  TIMED: "TIMED",
  ALL_DAY: "ALL_DAY",
};

export const PRESENTATION_TAGS = {
  FEATURED_PAGES: 0,
};

export const STREAM_TYPES = {
  VIDEO: "VIDEO",
  EDITOR: "EDITOR",
  IMAGE: "IMAGE",
  FILE: "FILE",
  POLL: "POLL",
};
