import React from 'react';
import './progress.css';

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.changeProgress = this.changeProgress.bind(this);
    this.state = {
      barColor: '#2f9842'
    };
  }
  changeProgress(e) {
    let progressBar = this.myRef.current;
    let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    this.props.onProgressChange && this.props.onProgressChange(progress);
  }
  render() {
    return (
      <div className="components-progress" ref={this.myRef} onClick={this.changeProgress}>
        <div className="progress" style={{width: `${this.props.progress}%`, backgroundColor: this.props.barColor ? this.props.barColor : this.state.barColor}}></div>
      </div>
    );
  }
}

export default Progress;