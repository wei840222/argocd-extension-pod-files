import './App.css'
import Spinner from './components/spinner.jsx'
import Icon from './components/icon.jsx'


function App({ application, resource }) {
  console.log(application)
  console.log(resource)

  return (
    <>
      <div className='white-box'>
        <div className='white-box__details'>
          <div className='row white-box__details-row'>
            <div className='columns small-3' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              <select className='argo-field' style={{ paddingBottom: '5.5px' }}>
                <option disabled>container</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Hamster</option>
                <option>Parrot</option>
                <option>Spider</option>
                <option>Goldfish</option>
              </select>
            </div>
            <div className='columns small-6' style={{ paddingLeft: '10px', paddingRight: '20px' }}>
              <input className='argo-field' />
            </div>
            <div className='columns small-3'>
              <button
                className='argo-button argo-button--base extension-button-small'
                style={{ marginLeft: '5px' }}
                onClick={console.log(resource)}
                disabled={false}>
                <span className='extension-button-text'>View</span>
                <Spinner show={false} />
                <Icon show={!false} icon='fa-solid fa-arrow-up-right-from-square' />
              </button>
              <button
                className='argo-button argo-button--base extension-button-small'
                style={{ marginLeft: '5px' }}
                onClick={console.log(resource)}
                disabled={false}>
                <span className='extension-button-text'>Download</span>
                <Spinner show={false} />
                <Icon show={!false} icon='fa-solid fa-download' />
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
