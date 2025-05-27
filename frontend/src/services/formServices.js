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

export const fetchformData = async (id) => {
        const res = await axios.post(`${formRoutes}/get-part-topic-question`, {
          id: id
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

          let topic = currentPart.topics.find(t => t.id === item.topicID);
          if (!topic) {
            topic = {
              id: item.topicID,           
              topic: item.topic,
              description: item.topicDescription, 
              type: item.topicType,
              topicDetail: {
                  ...item.typeDetail,
                  add: item.typeDetail?.min ?? null
                },
              questions: []
            };
            currentPart.topics.push(topic);
          }


          let question = topic.questions.find(q => q.id === item.questionID);
          if (!question) {
            question = {
              id: item.questionID,
              question: item.question,
              example: item.EXAMPLE,
              required: item.required,
              type: item.type,
              answer: [{answer: item.userAnswer, groupInstance: item.groupInstance}],
              listboxValue: []
            };
            topic.questions.push(question);
          }else {
            if (item.userAnswer !== undefined) {
              question.answer.push({
                answer: item.userAnswer,
                groupInstance: item.groupInstance ?? 0
              });
            }
          }

          if (item.type === "listbox" && item.text) {
            question.listboxValue.push(item.text);
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

export const fetchUserAnswer = async (formID, accountID) => {
      try {
        const res = await axios.post(`${formRoutes}/get-user-answer`, {
          formID: formID,
          accountID: accountID
        });
        return res.data;
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