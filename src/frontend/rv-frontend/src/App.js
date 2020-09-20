import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/search-bar.js'
import DoubleChart from './components/two-sided-chart.js';
import TimeSeries from './components/time_series.js';
import { FiHeart } from 'react-icons/fi'
const request = require('request');

function App() {
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sentiment_display, set_sentiment_display] = useState({})
  const [prod_name, set_prod_name] = useState("")

  function searchOnChange(event) {
    event.preventDefault();
    setInputValue(event.target.value);
  }

  function submitForm(event) {
    event.preventDefault();

    // make request to the backend endpoint
    request.get({
      url: 'http://127.0.0.1:5000/visualize?product_name=' + inputValue
    }, function (err, httpResponse, body) {
      if (err) {
        alert(err);
      }
      body = JSON.parse(body)
      console.log(body);
      console.log(body['overall_sentiment'])
      set_prod_name(inputValue);
      set_sentiment_display(body['overall_sentiment'])

      //setShowResult(true);
    })

  }

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (!isEmpty(sentiment_display)) {
      setShowResult(true);
    }
  }, [sentiment_display])

  function formatDoubleChart(body, prod_name) {
    console.log(body)
    if (!body) {
      return
    }
    if (body.hasOwnProperty("positive")) {
      console.log(body["positive"])
    } else {
      console.log('no')
    }
    return (
      <DoubleChart vnegative={body["very negative"] || 0}
                   negative={body["negative"] || 0}
                   positive={body["positive"] || 0}
                   vpositive={body["very positive"] || 0}
                   name={prod_name}
      />
    )
  }

  return (
    <div className="App">
      {!showResult &&
      <header className="App-header">
        <div className="title">Review Visualizer</div>
        <div className="subtitle">Presenting concise product review insights through data visualization.</div>
        <br/>
        <Search inputValue={inputValue}
                onChange={searchOnChange}
                onSubmit={submitForm}/>

      </header>
      }
      {showResult &&
        <div>
          <Search inputValue={inputValue}
                  onChange={searchOnChange}
                  onSubmit={submitForm}/>
          <div className="summary-text">Now showing review data summary for <strong>{prod_name}</strong></div>
          <div className="chart-summary">
            {formatDoubleChart(sentiment_display, prod_name)}
          </div>
        </div>
      }
      <TimeSeries input={[
        {date_time: '2015-08-28', total_km: 28},
        {date_time: '2015-08-22', total_km: 13}
      ]}/>
      <footer>
        Made with <FiHeart/> for HackMIT 2020. <a href="https://github.com/tchittesh/review-visualizer">View on Github</a>
      </footer>

    </div>
  );
}

export default App;
