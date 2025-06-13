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

function appendTopicToPart(topics, item, currentIndex) {
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
        currentIndex: currentIndex
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
      questionDetail: item.questionDetail,
      answer: [],
      choiceValue: []
    };
    topic.questions.push(question);
  }

  if ((item.type === "listbox" || item.type === "datalist" ) && item.choiceText) {
    const isDuplicatechoice = question.choiceValue.some(v => v.id === item.choiceID);
    if (!isDuplicatechoice) {
      question.choiceValue.push({
        id: item.choiceID,
        choice: item.choiceText
      });
    }
  }

  if (item.userAnswer) {
    const isDuplicateAnswer = question.answer.some(v => v.id === item.answerID);
    if (!isDuplicateAnswer) {
        question.answer.push({
          id: item.answerID,
          answer: item.userAnswer,
          groupInstance: item.groupInstance,
          subInstance: item.subInstance
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
            
            appendTopicToPart(inheritedTopic.children, item, item.topicType === 'multipleFile' ? null : 0);

            if (inheritedTopic.type === 'dynamicQuestion') {
              inheritedTopic.topicDetail.add = Math.max(
                inheritedTopic.topicDetail.add || 0,
                (item.groupInstance ?? 0) + 1,
                inheritedTopic.topicDetail.min
              ) || 1;
            }
            
          } else {
            appendTopicToPart(currentPart.topics, item, 0);
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

export const generatePDF = async (formTitle, formID, status, userID, data) => {
      try {
        const res = await axios.post(`${formRoutes}/generate-pdf`, {
            formTitle: formTitle,
            formID: formID,
            userID: userID,
            data: data,
            status, status
        })
      } catch (err) {
        console.error('fail to generate PDF:', err.message);
      }
}

export const uploadPDF = async (fileName, file, time) => {
      try {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('fileName', fileName);
        formData.append('time', time);
        const res = await axios.post(`${formRoutes}/upload-pdf`, formData)
      } catch (err) {
        console.error('fail to generate PDF:', err.message);
      }
}

export const fetchSpecialQuestion = async (id) => {
        const res = await axios.post(`${formRoutes}/get-special-question`, {
            formID: id
        });
        return res.data
    };

export const insertSpecialAnswer = async (table, column, value) => {
        const res = await axios.post(`${formRoutes}/insert-special-answer`, {
          table: table,
          column: column,
          value: value
        });
        return res.data
    };

export const insertNewDatalist = async (value) => {
        const res = await axios.post(`${formRoutes}/insert-new-datalist`, {
            value: value
        });
        return res.data
    };

  export const deletePdfPath = async (value) => {
        const res = await axios.post(`${formRoutes}/delete-pdf-path`, {
            path: value
        });
        console.log(res)
    };