import { useEffect, useReducer } from 'react'
import { Exam } from './components/Exam'
import { Header } from './components/Header'
import { Home } from './components/Home'
import { Result } from './components/Result'
import { Setup } from './components/Setup'
import { RECIPIENT_FULL } from './config'
import { BANK, BANK_BY_ID } from './data/bank'
import { clearSession, saveHistory, saveSession } from './lib/storage'
import { initState, reducer } from './state'

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initState())
  const { screen, session, history } = state

  // Keep the exam in localStorage so a refresh or an accidental tab close never loses progress.
  useEffect(() => {
    if (session) saveSession(session)
    else clearSession()
  }, [session])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  // Scroll to the top whenever the screen changes.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const inProgress = session !== null && session.submittedAt === null

  return (
    <>
      <Header screen={screen} onHome={() => dispatch({ type: 'goto', screen: 'home' })} locked={screen === 'exam'} />
      <main className="page">
        {screen === 'home' && <Home state={state} dispatch={dispatch} />}
        {screen === 'setup' && <Setup bank={BANK} dispatch={dispatch} resumable={inProgress} />}
        {screen === 'exam' && session && inProgress && <Exam session={session} lookup={BANK_BY_ID} dispatch={dispatch} />}
        {screen === 'result' && session && session.submittedAt !== null && (
          <Result session={session} lookup={BANK_BY_ID} history={history} dispatch={dispatch} />
        )}
      </main>
      <footer className="footer">
        <p>
          Made with happiness and deep respect for <strong>{RECIPIENT_FULL}</strong>. Wishing you every success, and much
          joy along the way.
        </p>
      </footer>
    </>
  )
}
