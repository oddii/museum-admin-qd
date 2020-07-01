const weatherInit = function () {
  const scriptWIDGET = document.createElement('script')
  scriptWIDGET.type = 'text/javascript'
  scriptWIDGET.innerHTML = `
  WIDGET = {
    CONFIG: {
      "layout": 1,
      "width": "422",
      "height": "140",
      "background": 5,
      "dataColor": "4A4A4A",
      "borderRadius": 5,
      "key": "9b489db8835148b8a775c02e68d5ee00"
    }
  }`

  const scriptSRC = document.createElement('script')
  scriptSRC.src = 'https://widget.heweather.net/standard/static/js/he-standard-common.js?v=1.1'

  const body = document.body
  body.appendChild(scriptWIDGET)
  body.appendChild(scriptSRC)
}

export default weatherInit
