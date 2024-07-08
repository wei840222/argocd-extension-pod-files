import { useState } from 'react'
import './App.css'
import Spinner from './components/spinner.jsx'
import Icon from './components/icon.jsx'


function App({ application, resource }) {
  const [container, setContainer] = useState(resource?.spec?.containers?.find(() => true)?.name || '')
  const [filePath, setFilePath] = useState('')

  const [isViewButtonPending, setIsViewButtonPending] = useState(false)
  const [isDownloadButtonPending, setIsDownloadButtonPending] = useState(false)

  const openByBlob = async (download = false) => {
    const res = await fetch(`/extensions/pod-files/files?namespace=${resource?.metadata?.namespace}&pod=${resource?.metadata?.name}&container=${container}&path=${filePath}`, {
      headers: {
        'ArgoCD-Project-Name': application?.spec?.project,
        'ArgoCD-Application-Name': `${application?.metadata?.namespace}:${application?.metadata?.name}`
      },
    })
    const blob = await res.blob()
    if (download) {
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = window.URL.createObjectURL(blob)
      a.setAttribute('download', filePath.replace(/^.*(\\|\/|:)/, ''))
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }
    window.open(window.URL.createObjectURL(blob), "_blank").focus()
  }

  const handleViewButtonClick = async () => {
    setIsViewButtonPending(true)
    try {
      await openByBlob()
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => setIsViewButtonPending(false), 1000)
    }
  }

  const handleDownloadButtonClick = async () => {
    setIsDownloadButtonPending(true)
    try {
      await openByBlob(true)
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => setIsDownloadButtonPending(false), 1000)
    }
  }

  return (
    <>
      <div className='white-box'>
        <div className='white-box__details'>
          <div className='row white-box__details-row'>
            <div className='columns small-3' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              <select
                className='argo-field'
                style={{ paddingBottom: '5.5px' }}
                value={container}
                onChange={e => setContainer(e.target.value)}
              >
                {resource?.spec?.containers?.map((val, idx) => (<option key={idx} value={val.name}>{val.name}</option>))}
              </select>
            </div>
            <div className='columns small-6' style={{ paddingLeft: '10px', paddingRight: '20px' }}>
              <input
                className='argo-field'
                type="text"
                placeholder="file path to download or upload"
                value={filePath}
                onChange={e => setFilePath(e.target.value)}
              />
            </div>
            <div className='columns small-3'>
              <button
                className='argo-button argo-button--base extension-button-small'
                style={{ marginLeft: '5px' }}
                onClick={handleViewButtonClick}
                disabled={isViewButtonPending}>
                <span className='extension-button-text'>View</span>
                <Spinner show={isViewButtonPending} />
                <Icon show={!isViewButtonPending} icon='fa-solid fa-arrow-up-right-from-square' />
              </button>
              <button
                className='argo-button argo-button--base extension-button-small'
                style={{ marginLeft: '5px' }}
                onClick={handleDownloadButtonClick}
                disabled={isDownloadButtonPending}>
                <span className='extension-button-text'>Download</span>
                <Spinner show={isDownloadButtonPending} />
                <Icon show={!isDownloadButtonPending} icon='fa-solid fa-download' />
              </button>
              <button
                className='argo-button argo-button--base extension-button-small'
                style={{ marginLeft: '5px' }}
                onClick={console.log(resource)}
                disabled={false}>
                <span className='extension-button-text'>Upload</span>
                <Spinner show={true} />
                <Icon show={!true} icon='fa-solid fa-cloud-arrow-up' />
              </button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default App
