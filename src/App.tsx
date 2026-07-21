import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

interface User {
  id: number
  name: string
  email: string
}

function App() {
  const [count, setCount] = useState(0)
  const [backendMsg, setBackendMsg] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setCount((count) => count + 1)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test`)
      const data = await res.text()
      setBackendMsg(data)
    } catch (err) {
      setBackendMsg('请求失败: ' + (err as Error).message)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`)
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('获取用户失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={handleClick}
        >
          Count is {count}
        </button>
        {backendMsg && (
          <p style={{ marginTop: '12px', color: '#4caf50' }}>
            后端返回: {backendMsg}
          </p>
        )}
        <button
          type="button"
          className="counter"
          onClick={fetchUsers}
          disabled={loading}
          style={{ marginTop: '12px' }}
        >
          {loading ? '加载中...' : '获取用户列表'}
        </button>
        {users.length > 0 && (
          <div style={{ marginTop: '16px', textAlign: 'left' }}>
            <h3>用户列表</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>姓名</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>邮箱</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
