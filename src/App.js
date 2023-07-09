import { useEffect, useState } from 'react';
import './App.scss';

const App = () => {
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState(null);
  const [previousChat, setPreviousChat] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  useEffect(() => {
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if(currentTitle && value && message) {
      setPreviousChat(prevChat => (
        [...prevChat, {
          title:currentTitle,
          role:'user',
          content:value
        }, {
          title:currentTitle,
          role:message.role,
          content:message.content
        }]
      ))
    }
  }, [message, currentTitle])

  const onSubmit = async() => {
    const payload = {
      method:'POST',
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type":'application/json'
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', payload);
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch(err) {
      console.error(err)
    }
  }

  const handleClick = (title) => {
    setCurrentTitle(title)
    setMessage(null)
    setValue(null)
  }

  const createNewChat = () => {
    setMessage(null)
    setValue(null)
    setCurrentTitle(null)
  }

  const currentChat = previousChat.filter(x => x.title === currentTitle)
  const uniqueTitle = Array.from(new Set(previousChat.map(x => x.title)))

  return (
    <div className="app">
      <section className='sidebar'>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          {
            uniqueTitle?.map((x,i) => <li onClick={() => handleClick(x)} key={i}>{x}</li>)
          }
          
        </ul>
        <nav>
          <p>Made by Faizan</p>
        </nav>
      </section>
      <section className='main'>
          <ul className='feed'>
            {currentChat?.map((x,i) => (
              <li key={i}>
                <p className='role'>{x.role}</p>
                <p>{x.content}</p>
              </li>
            ))}
          </ul>
          <div className='bottom-section'>
              <div className='input-container'>
                  <input value={value} onChange={e => setValue(e.target.value)}/>
                  <div className='submit' id='submit' onClick={onSubmit}>➢</div>
              </div>
              <p className='info'> 
              Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 24 Version
              </p>
          </div>
      </section>
    </div>
  );
}

export default App;
