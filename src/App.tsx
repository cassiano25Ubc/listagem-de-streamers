import { useStreamers } from './hooks/useStreamers'
import StreamerList from './components/StreamerList'
import './App.css'

function App() {
  const { streamers, isLoading, isRefreshing, error, refreshError, retry } =
    useStreamers()

  return (
    <main className="app-shell">
      <a className="skip-link" href="#streamers-content">
        Pular para a lista de streamers
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Streamers de xadrez - início">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>Streamers de xadrez</span>
        </a>
      </header>

      <section
        className="streamers-page"
        id="streamers-content"
        aria-labelledby="page-title"
        tabIndex={-1}
      >
        <div className="page-heading">
          <p className="eyebrow">Chess.com · Diretório de criadores</p>
          <h1 id="page-title">Encontre sua próxima partida ao vivo.</h1>
          <p className="page-description">
            Acompanhe streamers de xadrez e encontre seus canais em um só lugar.
          </p>
        </div>

        <section className="streamers-panel" aria-labelledby="streamers-title">
          <div className="panel-heading">
            <div>
              <h2 id="streamers-title">Streamers</h2>
              <p>Dados fornecidos pela API pública do Chess.com.</p>
            </div>
            <button
              className="refresh-button"
              type="button"
              onClick={() => void retry()}
              disabled={isLoading || isRefreshing}
            >
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          {isLoading && (
            <div className="list-placeholder" role="status">
              <span className="placeholder-icon" aria-hidden="true">
                ♞
              </span>
              <p>Carregando streamers...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="list-placeholder" role="alert">
              <p>{error}</p>
              <button
                className="refresh-button"
                type="button"
                onClick={() => void retry()}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {streamers.length === 0 ? (
                <div className="list-placeholder" role="status">
                  <span className="placeholder-icon" aria-hidden="true">
                    ♞
                  </span>
                  <p>Nenhum streamer foi encontrado.</p>
                </div>
              ) : (
                <StreamerList streamers={streamers} />
              )}
              {refreshError && (
                <p className="refresh-error" role="alert">
                  Não foi possível atualizar os dados. {refreshError} Os dados
                  carregados anteriormente foram mantidos.
                </p>
              )}
            </>
          )}
        </section>

        <p className="data-notice">
          O status exibido é o informado pelo Chess.com e pode estar desatualizado
          em até 12 horas. A atualização da página não garante um status em tempo
          real.
        </p>
      </section>
    </main>
  )
}

export default App
