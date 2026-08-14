import { DeleteResult, Repository, UpdateResult, Not, IsNull } from "typeorm";
import { Message } from "../entities/message.entity";
import { myDataSource } from "../connection/data-source";
import { AdminPart } from "../Enums/enums";

interface CreateMessageInput {
  text: string;
  senderId?: number | null;
  receiverId?: number | null;
}

const messageRepository: Repository<Message> =
  myDataSource.getRepository(Message);

const addMessage = async (data: CreateMessageInput): Promise<void> => {
  try {
    const adminPart = data.senderId ? AdminPart.RECEIVER : AdminPart.SENDER;
    const message = messageRepository.create({
      text: data.text,
      adminPart: adminPart,
      senderId: data.senderId ?? null,
      receiverId: data.receiverId ?? null,
    });
    await messageRepository.save(message);
  } catch (e) {
    throw new Error(`Error adding message to DB : ${e}`);
  }
};

const getUserMessages = async (
  userId: number
): Promise<{ text: string; isMine: boolean }[]> => {
  try {
    const messages = await messageRepository.find({
      select: ["text", "adminPart"],
      where: [{ senderId: userId }, { receiverId: userId }],
      order: {
        id: "ASC",
      },
    });

    return messages.map((message) => ({
      text: message.text,
      isMine: message.adminPart === AdminPart.RECEIVER,
    }));
  } catch (e) {
    throw new Error(`Error fetching messages for user ${userId}: ${e}`);
  }
};

const getManagerMessages = async () => {
  const raw = await fetchManagerMessagesFromDB();
  return orderManagerMessages(raw);
};

const fetchManagerMessagesFromDB = async () => {
  try {
    return await messageRepository.find({
      where: [{ senderId: IsNull() }, { receiverId: IsNull() }],
      order: { id: "ASC" },
    });
  } catch (e) {
    throw new Error(`Error fetching raw manager messages: ${e}`);
  }
};

const orderManagerMessages = (
  messages: Message[]
): {
  [userId: number]: { text: string; isMine: boolean }[];
} => {
  const chats: {
    [userId: number]: { text: string; isMine: boolean }[];
  } = {};

  for (const message of messages) {
    const isMine = message.adminPart === AdminPart.SENDER;

    const userId =
      message.adminPart === AdminPart.SENDER
        ? message.receiverId
        : message.senderId;

    if (!userId) continue;

    if (!chats[userId]) chats[userId] = [];

    chats[userId].push({
      text: message.text,
      isMine,
    });
  }

  return chats;
};

export { addMessage, getUserMessages, getManagerMessages };
