import axios from 'axios';
import { formRoutes } from '../config';

export const fetchTitleDescription = async (id) => {
        const res = await axios.post(`${formRoutes}/get-form-title-description`, {
            id: id
        });
        return {
            title: res.data[0].title,
            description: res.data[0].description
        }
    };

function appendTopicToPart(topics, item) {
  let topic = topics.find(t => t.id === item.topicID);

  if (!topic) {
    topic = {
      id: item.topicID,
      topic: item.topic,
      description: item.topicDescription,
      type: item.topicType,
      topicDetail: {
        ...item.typeDetail,
        add: 0,
        currentIndex: 0
      },
      children: [],
      questions: []
    };
    topics.push(topic);
  }

  topic.topicDetail.add = Math.max(
    topic.topicDetail.add || 0,
    (item.groupInstance ?? 0) + 1,
    topic.topicDetail.min
  ) || 1;

  appendQuestionToTopic(topic, item)
}


function appendQuestionToTopic(topic, item) {
  let question = topic.questions.find(q => q.id === item.questionID);

  if (!question) {
    question = {
      id: item.questionID,
      question: item.question,
      example: item.EXAMPLE,
      required: item.required,
      type: item.type,
      answer: [],
      listboxValue: []
    };
    topic.questions.push(question);
  }

  if (item.type === "listbox" && item.listboxText) {
    const isDuplicateListbox = question.listboxValue.some(v => v.id === item.listboxID);
    if (!isDuplicateListbox) {
      question.listboxValue.push({
        id: item.listboxID,
        listbox: item.listboxText
      });
    }
  }

  if (item.userAnswer) {
    const isDuplicateAnswer = question.answer.some(v => v.id === item.answerID);
    if (!isDuplicateAnswer) {
      question.answer.push({
        id: item.answerID,
        answer: item.userAnswer,
        groupInstance: item.groupInstance
      });
    }
  }
}


export const fetchformData = async (id, userID, partID) => {
        const res = await axios.post(`${formRoutes}/get-part-topic-question`, {
          formID: id,
          userID: userID,
          partID: partID
        });
        const rawData = res.data;
        const partMap = {};

        rawData.forEach(item => {
          if (!partMap[item.partID]) {
            partMap[item.partID] = {
              id: item.partID,             
              part: item.part,
              topics: []
            };
          }

          const currentPart = partMap[item.partID];

          if (item.typeDetail?.inherit) {
            const inheritedTopic = Object.values(partMap)
            .flatMap(part => part.topics)
                .find(t => t.id === item.typeDetail?.inherit);
            
            appendTopicToPart(inheritedTopic.children, item);
          } else {
            appendTopicToPart(currentPart.topics, item);
            }
        });
        return Object.values(partMap);
    };

export const insertUserAnswer = async (value) => {
      try {
        const res = await axios.post(`${formRoutes}/insert-user-answer`, {
          value: value
        });
      } catch (err) {
        console.error('fail to insert data:', err.message);
      }
    };

export const generatePDF = async (formTitle, formID, username, userID) => {
      try {
        const res = await axios.post(`${formRoutes}/generate-pdf`, {
            formTitle: formTitle,
            formID: formID,
            username: username,
            userID: userID,
        })
      } catch (err) {
        console.error('fail to generate PDF:', err.message);
      }
}