import axios from "axios";
import { useEffect, useState, useRef } from "react";
const host = "https://todolist-api.hexschool.io";
import { Button, Modal, Form } from "react-bootstrap";

function ToDo() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const token = useRef("");
  const [todo, setTodo] = useState([]); //todo陣列
  const [text, setText] = useState(""); //todo輸入文字
  //   const [isEditing, setIsEditing] = useState(false); //判斷是否需要編輯
  const [editText, setEditText] = useState(""); //編輯文字

  //登出
  const handleClose = () => {
    console.log(token.current);
    (async () => {
      const res = await axios.post(
        `${host}/users/sign_out`,
        {},
        {
          headers: {
            authorization: encodeURI(token.current),
          },
        }
      );
      console.log(res);
      console.log("登出");
    })();
    setShow(false);
  };

  //輸入input
  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //輸入todo
  const todoText = (e) => {
    setText(e.target.value);
  };

  //註冊
  const signUp = () => {
    console.log("註冊");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const nickname = document.querySelector("#nickname");
    if (email.value == "" || password.value == "" || nickname.value == "") {
      alert("欄位尚未填寫完全");
    } else {
      (async () => {
        try {
          const res = await axios.post(`${host}/users/sign_up`, form);
          console.log(res);
          alert("註冊成功!");
          setShow(true);
        } catch (err) {
          console.log(err);
          alert("註冊失敗，請重新填寫");
        }
        //怎麼快速清除標單上的字
        email.value = "";
        password.value = "";
        nickname.value = "";
      })();
    }
  };

  //登入
  const signIn = () => {
    console.log("登入");
    const email = document.querySelector("#signInEmail");
    const password = document.querySelector("#signInPassword");
    if (email.value == "" || password.value == "") {
      alert("欄位尚未填寫完全");
    } else {
      (async () => {
        try {
          const res = await axios.post(`${host}/users/sign_in`, form);
          console.log(res);
          alert("登入成功!");
          token.current = res.data.token;
          openModal();
        } catch (err) {
          console.log(err);
          alert("登入失敗，請重新填寫");
        }
        //怎麼快速清除標單上的字
        email.value = "";
        password.value = "";
      })();
    }
  };

  //確認
  const checkout = () => {
    console.log(token);
    (async () => {
      try {
        const res = await axios.get(`${host}/users/checkout`, {
          headers: {
            authorization: token.current,
          },
        });
        console.log("ToDo");
      } catch {
        alert("請重新登入");
      }
    })();
  };

  //打開modal
  const openModal = () => {
    checkout();
    renderTodo();
    setShow(true);
  };
  //渲染資料
  const renderTodo = () => {
    (async () => {
      const res = await axios.get(`${host}/todos/`, {
        headers: {
          authorization: token.current,
        },
      });
      console.log("資料渲染");
      console.log(res);
      setTodo([...res.data.data]);
    })();
  };
  //新增todo
  const addTodo = (e) => {
    (async () => {
      const res = await axios.post(
        `${host}/todos/`,
        { content: text },
        {
          headers: {
            authorization: token.current,
          },
        }
      );
      console.log("新增成功");
      renderTodo();
      const dom = document.querySelector("#todoText");
      dom.value = "";
    })();
  };
  //刪除todo
  const deleteTodo = (e) => {
    (async () => {
      const res = await axios.delete(`${host}/todos/${e.target.dataset.id}`, {
        headers: {
          authorization: token.current,
        },
      });
      console.log("刪除成功");
      renderTodo();
    })();
  };
  //更改todo
  const putTodo = (e) => {
    const id = document.querySelector(`#${e.target.dataset.name}`).id;
    const content = document.querySelector(`#${e.target.dataset.name}`).value;
    console.log(id, content);
    (async () => {
      const res = await axios.put(
        `${host}/todos/${id}`,
        { content: content },
        {
          headers: {
            authorization: token.current,
          },
        }
      );
      console.log("更改成功");
      renderTodo();
    })();
  };
  //切換狀態
  const toggleStates = (e) => {
    (async () => {
      const res = await axios.patch(
        `${host}/todos/${e.target.dataset.id}/toggle`,
        {},
        {
          headers: {
            authorization: token.current,
          },
        }
      );
      console.log("切換狀態");
      console.log(res);
      renderTodo();
    })();
  };
  //篩選
  let newTodo;
  const filterStates = (status = "all") => {
    if (status == "all") {
      newTodo = todo.map((item) => {
        return item;
      });
    } else if (status == "undone") {
      newTodo = todo.filter((item) => {
        return item.status == false;
      });
    } else if (status == "completed") {
      newTodo = todo.filter((item) => {
        return item.status == true;
      });
    }
    setTodo([...newTodo]);
    renderTodo();
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Link
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="user_sign_up">
        <div className="container">
          <div className="row row-cols-1 row-cols-lg-2 g-3">
            <div className="col">
              <div className="sign_up">
                <div className="card">
                  <div className="card-body text-center">
                    <h2 className="card-title mb-5">註冊會員</h2>
                    <div className="input-group mb-3">
                      <label htmlFor="email" className="input-group-text">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        onChange={handleInput}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <label htmlFor="password" className="input-group-text">
                        Password:
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        onChange={handleInput}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <label htmlFor="nickname" className="input-group-text">
                        Nickname:
                      </label>
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className="form-control"
                        onChange={handleInput}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={signUp}
                    >
                      註冊
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="sign_up">
                <div className="card">
                  <div className="card-body text-center">
                    <h2 className="card-title mb-5">會員登入</h2>
                    <div className="input-group mb-3">
                      <label htmlFor="signInEmail" className="input-group-text">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="signInEmail"
                        name="email"
                        className="form-control"
                        onChange={handleInput}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <label
                        htmlFor="signInPassword"
                        className="input-group-text"
                      >
                        Password:
                      </label>
                      <input
                        type="password"
                        id="signInPassword"
                        name="password"
                        className="form-control"
                        onChange={handleInput}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={signIn}
                    >
                      登入
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>To Do List</Modal.Title>
        </Modal.Header>
        <Modal.Body className="w-50 mx-auto">
          <div className="input-group">
            <label htmlFor="todoText" className="input-group-text">
              新增內容
            </label>
            <input
              type="text"
              id="todoText"
              className="form-control"
              onChange={todoText}
            />
            <button type="button" onClick={addTodo} className="btn btn-primary">
              新增
            </button>
          </div>
          <hr />
          <div className="mb-4">
            <div className="row row-cols-lg-3 g-3">
              <div className="col">
                <button
                  type="button"
                  onClick={() => filterStates()}
                  className="btn btn-primary w-100"
                >
                  全部
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  onClick={() => filterStates("undone")}
                  className="btn btn-primary w-100"
                >
                  未完成
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  onClick={() => filterStates("completed")}
                  className="btn btn-primary w-100"
                >
                  已完成
                </button>
              </div>
            </div>
          </div>
          <div className="w-50 mx-auto">
            {todo.map((item) => {
              return (
                <div key={item.id}>
                  <div
                    key={item.id}
                    className="alert alert-warning "
                    role="alert"
                  >
                    <div className="d-flex flex-row align-items-center justify-content-between">
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        data-id={item.id}
                        checked={!item.status}
                        onChange={toggleStates}
                      />
                      {item.status ? (
                        <>
                          <div className="text-nowrap ">
                            <del>{item.content}</del>
                          </div>

                          <button
                            data-id={item.id}
                            type="button"
                            className="btn-close float-end"
                            onClick={deleteTodo}
                          ></button>
                        </>
                      ) : (
                        <>
                          <div className="text-nowrap">{item.content}</div>
                          <div className="input-group">
                            <input
                              type="text"
                              defaultValue={item.content}
                              id={item.id}
                              className="form-control"
                            />
                            <input
                              type="button"
                              className="btn btn-primary"
                              value="更改"
                              data-name={item.id}
                              onClick={putTodo}
                            />
                          </div>
                          <button
                            data-id={item.id}
                            type="button"
                            className="btn-close float-end"
                            onClick={deleteTodo}
                          ></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            登出
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ToDo;
