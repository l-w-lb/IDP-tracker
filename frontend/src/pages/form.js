import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../styles/form.css';
import '../styles/global.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { fetchTitleDescription, fetchUserAnswer, fetchformData, insertUserAnswer, generatePDF } from '../services/formServices.js';

function Form() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formData, setFormData] = useState([]);

  // mockup data
  // let id = 1; //formID
  let accountID = 3;

  useEffect(() => {
    const loadData = async () => {
      try {
        const { title, description } = await fetchTitleDescription(id);
        setFormTitle(title);
        setFormDescription(description);

        const structure = await fetchformData(id);
        setFormData(structure);

        const userAnswer = await fetchUserAnswer(id,accountID);
        console.log('get data',structure);
        
      } catch (err) {
        console.error('Error loading form data:', err.message);
      }
    };

    loadData();
  }, []);

  const insertAnswer = async (value) => {
      try {
        const insertAnswers = await insertUserAnswer(value);
      } catch (err) {
        console.error('fail to insert data:', err.message);
      }
    };

  const generatePDF = async (formTitle, additional, username) => {
    console.log('pdf generated');
      try {
        const genPDF = await generatePDF(formTitle, additional, username);
      } catch (err) {
        console.error('fail to generates PDF:', err.message);
      }
  }

  const handleAnswerChange = (partIndex, topicIndex, questionIndex, groupInstance, newAnswer) => {
  setFormData(prevFormData => {
    const updated = [...prevFormData];
    const questions = [...updated[partIndex].topics[topicIndex].questions];
    const question = { ...questions[questionIndex] };

    const updatedAnswers = question.answer.some(a => a.groupInstance === groupInstance)
      ? question.answer.map(a =>
          a.groupInstance === groupInstance ? { ...a, answer: newAnswer } : a
        )
      : [...question.answer, { groupInstance, answer: newAnswer }];

    question.answer = updatedAnswers;
    questions[questionIndex] = question;
    updated[partIndex].topics[topicIndex].questions = questions;
    console.log(updated)
    return updated;
  });
};


  const handlePlusClick = (partIndex, topicIndex) => {
    let currentValue = formData[partIndex]?.topics[topicIndex]?.topicDetail?.add || 0;
    currentValue += 1;
    setFormData(prevFormData => {
        const updatedFormData = [...prevFormData];
          updatedFormData[partIndex].topics[topicIndex].topicDetail.add = currentValue;
        return updatedFormData;
    })
  };

  const handleBack = () => {
    navigate('/formList')
  }

  const handleSubmit = () => {
    for (const section of formData) {
      for (const topic of section.topics) {
          for (const question of topic.questions) {
            if (question.required) {
              let hasAnyAnswer = true;
              if (topic.type === 'multipleAnswer') {
                  const min = topic.topicDetail?.min;
                  console.log(min)
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
                  console.log('ข้อมูล',formData);
                  alert("กรุณากรอกทุกคำถามที่จำเป็นต้องตอบ");
                  return;
                }
            }
          }
        }
      }

      const result = [];

      formData.forEach(part => {
        part.topics.forEach(topic => {
          topic.questions.forEach(question => {
            if (Array.isArray(question.answer)) {
              question.answer.forEach((a, instanceIndex) => {
                if (a.answer && a.answer.trim() !== '') {
                  result.push([
                    question.id,
                    accountID,
                    a.groupInstance,
                    a.answer,
                  ]);
                }
              });
            }
          });
        });
      });

      
      if (result == '') {
          alert("ยังไม่ได้มีการกรอกคำตอบ");
          return
      }
      console.log('ข้อมูลที่เก็บลงดาต้าเบส', result)
      insertAnswer(result);
      generatePDF(formTitle,1,2);
      // alert("เก็บข้อมูลลงดาต้าเบสแล้ว");
      navigate('/formList');
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

        {/* formData */}
        {formData.map((part, formDataIndex) => (
          <div key={formData.id}>
                {part.part && (
                    <div className="card p-4 my-3 text-center part center-card">
                      <div>{part.part}</div>
                    </div>
                )}

            <div>
                {part.topics.map((topicElement, topicElementIndex) => 
                    <div key={topicElement.id}>
                        <div className="card p-4 my-3 center-card">
                          <div className="mb-1 mt-1 topic">{topicElement.topic}</div>
                          <div className="mb-1 mt-1 description">{topicElement.description}</div>
                          <hr />
                          <div className="mb-3 question">
                            {topicElement.type === "multipleAnswer" ? (
                              <div>
                                  {Array.from({
                                    length: Math.max(
                                      topicElement.topicDetail.add ?? 1,
                                      ...topicElement.questions.map(q => q.answer?.length ?? 0)
                                    )
                                  }).map((_, multipleIndex) => (
                                    <div key={multipleIndex}>
                                      {topicElement.questions.map((question, questionIndex) => {
                                        return (
                                            <div key={question.id}>
                                                <div 
                                                  className="mb-1 mt-1">{question.question}
                                                  {(multipleIndex < topicElement.topicDetail.min && Boolean(question.required) && <span style={{ color: 'red' }}> *</span>)}
                                                </div>

                                                <div className="mb-1 mt-1 example">{question.example}</div>
                                              
                                                {question.type === 'listbox' ? (
                                                    <div className="mb-4 mt-2">
                                                      <select
                                                          value={formData[formDataIndex]?.topics[topicElementIndex]?.questions[questionIndex]?.answer.find(a => a.groupInstance === multipleIndex)?.answer || ''}
                                                          className='listbox'
                                                          onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            handleAnswerChange(formDataIndex, topicElementIndex, questionIndex, multipleIndex, newValue); 
                                                          }}
                                                        >
                                                          <option value="" disabled>เลือก</option>
                                                          {question.listboxValue.map((item, itemIndex) => (
                                                            <option key={itemIndex} value={item}>
                                                              {item}
                                                            </option>
                                                          ))}
                                                      </select>
                                                    </div>
                                                ) : (
                                                  <div className="mb-4">
                                                    <input
                                                      type="text"
                                                      className="input-field"
                                                      placeholder="คำตอบของคุณ"
                                                      value={formData[formDataIndex]?.topics[topicElementIndex]?.questions[questionIndex]?.answer.find(a => a.groupInstance === multipleIndex)?.answer}
                                                      onChange={(e) => {
                                                        handleAnswerChange(formDataIndex, topicElementIndex, questionIndex, multipleIndex, e.target.value)
                                                      }}
                                                    />
                                                  </div>
                                                )}
                                            </div>
                                        )
                                      })}
                                      <hr className='my-5'></hr>                
                                    </div>
                                  ))}

                                  <div className="d-flex justify-content-center">
                                    <button 
                                      className="btn-plus"
                                      onClick={() => handlePlusClick(formDataIndex, topicElementIndex)}
                                    >
                                      <i className="bi bi-plus-circle-fill fs-2 mt-3"></i>
                                    </button>
                                  </div>
                              </div>
                            ):(
                                <div>
                                  {topicElement.questions.map((question, questionIndex) => {
                                    return (
                                        <div key={question.id}>
                                            <div 
                                              className="mb-1 mt-1">{question.question}
                                              {Boolean(question.required) && <span style={{ color: 'red' }}> *</span>}
                                            </div>
                                            <div className="mb-1 mt-1 example">{question.example}</div>

                                            {question.type === 'listbox' ? (
                                                <div className="mb-4 mt-2">
                                                  <select
                                                      value={formData[formDataIndex]?.topics[topicElementIndex]?.questions[questionIndex]?.answer[0]?.answer || ''}
                                                      className='listbox'
                                                      onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        handleAnswerChange(formDataIndex, topicElementIndex, questionIndex, 0, newValue); 
                                                      }}
                                                    >
                                                      <option value="" disabled>เลือก</option>
                                                      {question.listboxValue.map((item, itemIndex) => (
                                                        <option key={itemIndex} value={item}>
                                                          {item}
                                                        </option>
                                                      ))}
                                                  </select>
                                                </div>
                                            ) : (
                                              <div className="mb-4">
                                                <input
                                                  type="text"
                                                  className="input-field"
                                                  placeholder="คำตอบของคุณ"
                                                  value={formData[formDataIndex]?.topics[topicElementIndex]?.questions[questionIndex]?.answer[0]?.answer}
                                                      onChange={(e) => {
                                                        handleAnswerChange(formDataIndex, topicElementIndex, questionIndex, 0, e.target.value)
                                                      }}                                                
                                                />
                                              </div>
                                            )}
                                        </div>
                                    )
                                  })}
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                )}
            </div>
          </div>
        ))}
        
        <div className="d-flex justify-content-center">
          <button className="btn btn-success mb-3 mx-2" onClick={handleBack}>
            Back
          </button>
          <button className="btn btn-success mb-3 mx-2" onClick={handleSubmit}>
            Submit
          </button>
        </div>

      </div>
      
  );
}

export default Form;