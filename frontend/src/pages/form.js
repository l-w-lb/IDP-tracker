import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useUser } from '../context/userContext.js';
import { useFormContext } from '../context/FormContext.js';
import DatePicker from 'react-datepicker';
import { BASE_URL } from '../config.js';

import '../styles/form.css';
import '../styles/global.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';

import { fetchTitleDescription, fetchformData, insertUserAnswer, generatePDF, uploadPDF } from '../services/formServices.js';

function Form() {
  const { user } = useUser();
  const { form, setForm } = useFormContext();
  const accountID = user.id;
  const id = form.formID;
  const partID = form.partID
  // console.log(form)

  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formData, setFormData] = useState([]);

  // mockup data
  // let id = 1; //formID
  // let accountID = 3;

  useEffect(() => {
    if (!user || !user.id) return; 

    const accountID = user.id;

    const loadData = async () => {
      try {
        const { title, description } = await fetchTitleDescription(id);
        setFormTitle(title);
        setFormDescription(description);

        const structure = await fetchformData(id, accountID, partID);
        setFormData(structure);
        console.log(structure);
      } catch (error) {
        console.error('Load error:', error);
      }
    };

    loadData();
  }, [id, user]); 


  const insertAnswer = async (value) => {
      try {
        const insertAnswers = await insertUserAnswer(value);
      } catch (err) {
        console.error('fail to insert data:', err.message);
      }
    };

  const genPDF = async (formTitle, formID, data, userID) => {
    console.log('pdf generated');
      try {
        const genPDF = await generatePDF(formTitle, formID, data, userID);
      } catch (err) {
        console.error('fail to generates PDF:', err.message);
      }
  }

  const handleAnswerChange = (partIndex, topicIndex, childIndex, questionIndex, groupInstance, subInstance, newAnswer, isChild) => {
    setFormData(prevFormData => {
      const updated = [...prevFormData];
      const questions = isChild
        ? [...updated[partIndex].topics[topicIndex].children[childIndex].questions]
        : [...updated[partIndex].topics[topicIndex].questions];
      const question = { ...questions[questionIndex] };

      const updatedAnswers = question.answer.some(a => a.groupInstance === groupInstance && a.subInstance === subInstance)
        ? question.answer?.map(a =>
            a.groupInstance === groupInstance && a.subInstance === subInstance
              ? { ...a, answer: newAnswer } 
              : a
          )
        : [...question.answer, { groupInstance, answer: newAnswer, id, subInstance }];

      question.answer = updatedAnswers;
      questions[questionIndex] = question;
      if (isChild) {
        updated[partIndex].topics[topicIndex].children[childIndex].questions = questions;
      } else {
        updated[partIndex].topics[topicIndex].questions = questions;
      }
      console.log(updated)
      return updated;
    });
  };

  const handlePlusMinusClick = (partIndex, topicIndex, childIndex, action, isChild) => {
    let currentValue = isChild 
      ? formData[partIndex]?.topics[topicIndex]?.children[childIndex]?.topicDetail?.add
      : formData[partIndex]?.topics[topicIndex]?.topicDetail?.add || 0;
    const min = isChild
      ? formData[partIndex]?.topics[topicIndex]?.children[childIndex]?.topicDetail?.min
      : formData[partIndex]?.topics[topicIndex]?.topicDetail?.min || 1;
    currentValue = Math.max(currentValue + action, min);
    setFormData(prevFormData => {
        const updatedFormData = [...prevFormData];
          updatedFormData[partIndex].topics[topicIndex].topicDetail.add = currentValue;
        return updatedFormData;
    })
  };

  const handleShowFileData = (partIndex, topicIndex, childIndex, index, isChild) => {
    const current = isChild 
        ? formData[partIndex].topics[topicIndex].children[childIndex].topicDetail.currentIndex
        : formData[partIndex].topics[topicIndex].topicDetail.currentIndex;

    setFormData(prevData => {
      const updated = [...prevData];
      if (isChild) {
        updated[partIndex].topics[topicIndex].children[childIndex].topicDetail.currentIndex =
          current === index ? null : index;
      } else {
        updated[partIndex].topics[topicIndex].topicDetail.currentIndex =
          current === index ? null : index;
      }

      return updated;
    })
  };

  const handleDeleteFile = (partIndex, topicIndex, childIndex, groupInstance, subInstance, isChild) => {
    setFormData(prevData => {
      const updated = [...prevData];
      const questions = isChild 
        ? formData[partIndex].topics[topicIndex].children[childIndex].questions
        : formData[partIndex].topics[topicIndex].questions;

      questions.map((question, questionIndex) => {
        question.answer.map((ans, ansIndex) => {
          if (ans.groupInstance === groupInstance && ans.subInstance === subInstance) {
            if (isChild) {
              updated[partIndex].topics[topicIndex].children[childIndex].questions[questionIndex].answer[ansIndex].answer = '';
            } else {
              updated[partIndex].topics[topicIndex].questions[questionIndex].answer[ansIndex].answer = '';
            }
          }
        })
      })

      return updated;
    })
  };

  const handleSubmit = () => {
    for (const section of formData) {
      for (const topic of section.topics) {
          for (const question of topic.questions) {
            if (question.required) {
              let hasAnyAnswer = true;
              if (topic.type === 'multipleAnswer') {
                  const min = topic.topicDetail?.min;
                  for (let i = 0; i < min; i++) {
                    const found = question.answer.find(
                      a => a.groupInstance === i && a.answer && a.answer.trim() !== ''
                    );

                    if (!found) {
                      console.log(question)
                      hasAnyAnswer = false;
                    }
                  }
              } else {
                  hasAnyAnswer = Array.isArray(question.answer) && question.answer.some(a => a.answer && a.answer.trim() !== '');
                }

              if (!hasAnyAnswer) {
                  console.log('ข้อมูล',formData);
                  alert("กรุณากรอกทุกคำถามที่จำเป็นต้องตอบ");
                  return;
                }
            }
          }

          if (Array.isArray(topic.children)) {
            for (const child of topic.children) {
              for (const question of child.questions) {
                if (question.required) {
                  let hasAnyAnswer = true;
                  if (child.type === 'multipleAnswer') {
                    const min = topic.topicDetail?.min;
                    for (let i = 0; i < min; i++) {
                      const found = question.answer.find(
                        a => a.groupInstance === i && a.answer && a.answer.trim() !== ''
                      );
                      if (!found) {
                        hasAnyAnswer = false;
                      }
                    }
                  } else {
                    hasAnyAnswer = Array.isArray(question.answer) && question.answer.some(a => a.answer && a.answer.trim() !== '');
                  }

                  if (!hasAnyAnswer) {
                    console.log('ข้อมูล', formData);
                    alert("กรุณากรอกทุกคำถามที่จำเป็นต้องตอบ");
                    return;
                  }
                }
              }
            }
          }
        }
      }

      let result = [];

      formData.forEach(part => {
        part.topics.forEach(topic => {
          let newResult = formatAns(topic);
          result = [...result, ...newResult]

          if (topic.children.length !== 0) {
            topic.children.forEach(topic => {
              newResult = formatAns(topic);
              result = [...result, ...newResult]
            })
          }
        });
      });

      if (result === '') {
          alert("ยังไม่ได้มีการกรอกคำตอบ");
          return
      }
      console.log('ข้อมูลที่เก็บลงดาต้าเบส', result)
      insertAnswer(result);
      genPDF(formTitle,id,user.username,user.id);
      // alert("เก็บข้อมูลลงดาต้าเบสแล้ว");
      navigate('/formList');
  };

  const formatAns = (topic) => {
      const result = [];

        topic.questions.forEach(question => {
          if (Array.isArray(question.answer)) {
            question.answer.forEach((a, instanceIndex) => {
              if (a.answer != null) {
                result.push([
                  question.id,
                  accountID,
                  a.groupInstance,
                  a.subInstance,
                  a.answer,
                ]);
              }
            });
          }
        });

      return result
  }

  const handleTopicNav = (partIndex, topicIndex, direction, maxPages) => {
    const current = formData[partIndex].topics[topicIndex].topicDetail.currentIndex || 0;
    const next = Math.min(Math.max(current + direction, 0), maxPages - 1);
    setFormData(prev => {
      const updated = [...prev];
      updated[partIndex].topics[topicIndex].topicDetail.currentIndex = next;
      return updated;
    });
  };

  // useEffect(() => {
  //   console.log(formData)
  // },[formData])

  function renderAnswerInput({
    question,
    formDataIndex,
    topicElementIndex,
    questionIndex,
    topicElement,
    childTopicIndex,
    subCurrentIndex,
    handleAnswerChange,
    isChild
  }) {
    // if (isChild) {
    //   console.log(formData[formDataIndex]?.topics[topicElementIndex]?.children[childTopicIndex]?.topicDetail)
    // }
    
    const currentIndex =
      formData[formDataIndex]?.topics[topicElementIndex]?.topicDetail.currentIndex;

    const currentSubIndex =
      formData[formDataIndex]?.topics[topicElementIndex]?.children[childTopicIndex]?.topicDetail.currentIndex;

    const answer = isChild
      ? formData[formDataIndex]?.topics[topicElementIndex]?.children?.[childTopicIndex]?.questions?.[questionIndex]?.answer?.find
        (a => a.groupInstance === currentIndex && a.subInstance === currentSubIndex)?.answer || ''
      : topicElement.questions[questionIndex]?.answer?.find(a => a.groupInstance === currentIndex)?.answer || '';

    if (question.type === 'listbox') {
      return (
        <div className="mb-4 mt-2">
          <select
            value={answer}
            className="listbox"
            onChange={(e) => handleAnswerChange(formDataIndex, topicElementIndex, childTopicIndex, questionIndex, currentIndex, subCurrentIndex, e.target.value, isChild)}
          >
            <option value="" disabled>เลือก</option>
            {question?.listboxValue?.map((item, itemIndex) => (
              <option key={itemIndex} value={item.listbox}>
                {item.listbox}
              </option>
            ))}
          </select>
        </div>
      );
    } else if ((question.type === 'inputField')) {
      return (
        <div className="mb-4">
          <input
            type="text"
            className="input-field"
            placeholder="คำตอบของคุณ"
            value={answer}
            onChange={(e) => handleAnswerChange(formDataIndex, topicElementIndex, childTopicIndex, questionIndex, currentIndex, subCurrentIndex, e.target.value, isChild)}
          />
        </div>
      );
    } else if ((question.type === 'date')) {
      return (
        <div className="mb-4 mt-2">
          <DatePicker
            selected={answer ? new Date(answer) : null}
            onChange={(date) => {
              const formatted = formatDateToISO(date);
              handleAnswerChange(
                formDataIndex,
                topicElementIndex,
                childTopicIndex,
                questionIndex,
                currentIndex,
                subCurrentIndex,
                formatted,
                isChild
              );
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      )
    } else if ((question.type === 'file')) {
      return (
        <div className="mb-4 mt-2">
          <input
            type="file"
            className="form-control file mt-3"
            id="pdfUpload"
            accept="application/pdf"
            multiple
            onChange={(e) => 
              handlePdfUpload(
                formDataIndex,
                topicElementIndex,
                childTopicIndex,
                questionIndex,
                currentIndex,
                e.target.files,
                isChild,
                formTitle
              )
            }
          />
        </div>
      )
    }
  }

  const renderTopicNavigation = ({
    topicElement,
    formDataIndex,
    topicElementIndex,
    childIndex,
    handleTopicNav,
    handlePlusMinusClick,
    isChild
  }) => {
    return (
      <div className="card-navigation-container">
        <button 
          className="arrow left"
          onClick={() => handleTopicNav(formDataIndex, topicElementIndex, -1, topicElement.topicDetail.add)}
          disabled={topicElement.topicDetail.currentIndex === 0}
        >
          <i className="bi bi-caret-left-fill fs-1"></i>
        </button>

        <span className="page-info multiple-ans-index mt-5">
          {topicElement.topicDetail.currentIndex + 1} / {topicElement.topicDetail.add}
        </span>

        <div className="d-flex justify-content-center">
          <button
            className="btn-minus"
            onClick={() => handlePlusMinusClick(formDataIndex, topicElementIndex, childIndex, -1, isChild)}
            disabled={topicElement.topicDetail.add <= topicElement.topicDetail.min}
          >
            <i className="bi bi-dash-circle-fill fs-2 mt-3"></i>
          </button>

          <button 
            className="btn-plus"
            onClick={() => handlePlusMinusClick(formDataIndex, topicElementIndex, childIndex, 1, isChild)}
          >
            <i className="bi bi-plus-circle-fill fs-2 mt-3"></i>
          </button>
        </div>

        <button 
          className="arrow right"
          onClick={() => handleTopicNav(formDataIndex, topicElementIndex, 1, topicElement.topicDetail.add)}
          disabled={topicElement.topicDetail.currentIndex === topicElement.topicDetail.add - 1}
        >
          <i className="bi bi-caret-right-fill fs-1"></i>
        </button>
      </div>
    );
  };

  const renderTopicQuestions = ({
    topic,
    formDataIndex,
    topicElementIndex,
    childTopicIndex,
    handleAnswerChange,
    renderAnswerInput,
    isChild
  }) => {
    const topicElement = isChild
      ? topic?.children?.[childTopicIndex] || []
      : topic || [];

    const topicDetail = topic?.topicDetail;

    if (topicElement.type === "multipleAnswer") {
      return (
        <div>
          {topicElement?.questions?.map((question, questionIndex) => {
            return (
            <div key={question.id}>
              <div className="mb-1 mt-1">
                {question.question}
                {(
                  topicDetail.currentIndex < topicDetail.min && Boolean(question.required)) && (
                  <span style={{ color: 'red' }}> *</span>
                )}
              </div>
              <div className="mb-1 mt-1 example">{question.example}</div>

              {renderAnswerInput({
                question,
                formDataIndex,
                topicElementIndex,
                questionIndex,
                topicElement,
                childTopicIndex,
                subCurrentIndex: 0,
                handleAnswerChange,
                isChild
              })}
            </div>
          )})}
        </div>
      )
    } else if (topicElement.type === "singleAnswer") {
      return (
        <div>
          {topicElement?.questions?.map((question, questionIndex) => (
            <div key={question.id}>
              <div className="mb-1 mt-1">
                {question.question}
                {Boolean(question.required) && <span style={{ color: 'red' }}> *</span>}
              </div>
              <div className="mb-1 mt-1 example">{question.example}</div>

              {renderAnswerInput({
                question,
                formDataIndex,
                topicElementIndex,
                questionIndex,
                topicElement,
                childTopicIndex,
                subCurrentIndex: 0,
                handleAnswerChange,
                isChild
              })}
            </div>
          ))}
        </div>
      )
    } else if (topicElement.type === "multipleFile") {
      const question = topicElement?.questions[0]
      return (
        <div>
          <div className="mb-1 mt-1">
            {question.question}
            {Boolean(question.required) && <span style={{ color: 'red' }}> *</span>}
          </div>
          <div className="mb-1 mt-1 example">{question.example}</div>

          {renderAnswerInput({
            question,
            formDataIndex,
            topicElementIndex,
            questionIndex: 0,
            topicElement,
            childTopicIndex,
            subCurrentIndex: 0,
            handleAnswerChange,
            isChild
          })}

          <div className='mt-3'>
            {question.answer.map((answer, index) => {
                return answer.answer !== '' && answer.groupInstance === topicDetail.currentIndex && (
                  <div key={index}>
                    {/* show file name */}
                    <span style={{ cursor: 'pointer' }} onClick={() => handleShowFileData(formDataIndex, topicElementIndex, childTopicIndex, index, isChild)}>
                      {topicElement.topicDetail.currentIndex === index
                        ? <i className="bi bi-caret-down-fill">  </i>
                        : <i className="bi bi-caret-right-fill">  </i>
                      }
                      <span>{answer.answer.split('/').pop().replace(/^\d+_/, '')}</span>

                      <span
                        className="btn-preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          const pdfUrl = BASE_URL + answer.answer;
                          console.log(pdfUrl)
                          window.open(pdfUrl, '_blank');
                        }}
                      >
                        preview
                      </span>
                      
                      <span
                        className='btn-delete'
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleDeleteFile(formDataIndex, topicElementIndex, childTopicIndex, answer.groupInstance, answer.subInstance, isChild);
                        }}
                      >
                        delete
                      </span>
                    </span>

                    {/* show question */}
                    {topicElement?.questions.map((question, questionIndex) => {
                      return questionIndex > 0 && 
                        topicElement.topicDetail.currentIndex === index && (
                        <div key={questionIndex}>
                          <div className="mb-1 mt-1">
                            {question.question}
                            {Boolean(question.required) && <span style={{ color: 'red' }}> *</span>}
                          </div>
                          <div className="mb-1 mt-1 example">{question.example}</div>

                          {renderAnswerInput({
                            question,
                            formDataIndex,
                            topicElementIndex,
                            questionIndex,
                            topicElement,
                            childTopicIndex,
                            subCurrentIndex: index,
                            handleAnswerChange,
                            isChild
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
            })}
          </div>
        </div>
      )
    }
    
  };
  
  function formatDateToISO(date) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; 
  }

  const handlePdfUpload = async (
    partIndex,
    topicIndex,
    childIndex,
    questionIndex,
    groupInstance,
    newAnswer,
    isChild,
    formTitle
  ) => {
    const files = Array.from(newAnswer);
    const time = Date.now();

    const answers = isChild
      ? formData[partIndex].topics[topicIndex].children[childIndex].questions[questionIndex].answer
      : formData[partIndex].topics[topicIndex].questions[questionIndex].answer;

    const emptySubInstances = answers
      .filter(ans => ans.answer === '')
      .map(ans => ans.subInstance);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const fileName = `${file.name}`;
      const fileUrl = `/uploads/answers/${time}_${fileName}`;

      const currentSubInstance = index < emptySubInstances.length
        ? emptySubInstances[index]
        : answers.length + index;

      handleAnswerChange(
        partIndex,
        topicIndex,
        childIndex,
        questionIndex,
        groupInstance,
        currentSubInstance,
        fileUrl,
        isChild
      );

      try {
        await uploadPDF(fileUrl, file, time);
      } catch (err) {
        console.error('fail to generate PDF:', err.message);
      }
    }
  };



  return (
      <div >
        {/* header */}
        <div>
            <div className="card p-4 my-3 text-center center-card">
                <div className="title">{formTitle}</div>
                <div className="description mt-3">{formDescription}</div>
            </div>
        </div>

        {/* part */}
        {form.part &&
          (
            <div className="card p-4 my-3 text-center part center-card">
              <div>{form.part}</div>
            </div>
        )}

        {/* part topic question */}
        {formData?.map((part, formDataIndex) => {
            return (
              <div key={formData.id}>
                <div>
                    { 
                        part?.topics?.map((topicElement, topicElementIndex) => {
                          return (  
                            <div key={topicElement.id}>
                              <div className="card p-4 my-3 center-card">
                                <div className="mb-1 mt-1 topic">{topicElement.topic}</div>
                                <div className="mb-1 mt-1 description">{topicElement.description}</div>
                                <hr />
                                <div className="mb-3 question">
                                  
                                  {renderTopicQuestions({
                                    topic: topicElement,
                                    formDataIndex,
                                    topicElementIndex,
                                    childTopicIndex: null,
                                    handleAnswerChange,
                                    renderAnswerInput,
                                    isChild: false
                                  })}

                                </div>

                                {/* children */}
                                {topicElement?.children.length !== 0 && (
                                    <div>
                                      {topicElement.children.map((childTopic, childTopicIndex) => (
                                        <div key={childTopic.id}>
                                          {/* <div className="card p-4 my-3 center-card"> */}
                                            <hr className='mt-5 mb-5'/>
                                            <div className="mb-1 mt-1 topic">{childTopic.topic}</div>
                                            <div className="mb-1 mt-1 description">{childTopic.description}</div>
                                            <hr />
                                            <div className="mb-3 question">
                                              {renderTopicQuestions({
                                                topic: topicElement,
                                                formDataIndex,
                                                topicElementIndex,
                                                childTopicIndex,
                                                handleAnswerChange,
                                                renderAnswerInput,
                                                isChild: true
                                              })}
                                            </div>
                                          </div>
                                        // </div>
                                      ))}
                                  </div>
                                )}
                                
                                {/* multi ans nav */}
                                {topicElement.type === "multipleAnswer" && (
                                  <div>
                                      {renderTopicNavigation({
                                        topicElement,
                                        formData,
                                        formDataIndex,
                                        childIndex: 0,
                                        topicElementIndex,
                                        handleTopicNav,
                                        handlePlusMinusClick,
                                        isChild: false
                                      })}
                                  </div>
                                )}

                              </div>
                            </div>
                          )
                        })
                    }
                </div>
              </div>
            )
        })}
        <div className="d-flex justify-content-center">
          <button className="btn btn-success mb-3 mx-2" onClick={() => handleSubmit()}>
            ส่ง
          </button>
        </div>
      </div>
      
  );
}

export default Form;