import React from 'react';
import $ from 'jquery';
import jPlayer from 'jplayer';
import Header from './header';
import Player from '../page/player';
import MusicList from '../page/musiclist';
import {
  MUSIC_LIST
} from '../config/musiclist';
import {
  BrowserRouter as
  Router,
  Link,
  Route,
  HashRouter,
  Switch
} from 'react-router-dom';
import Pubsub from 'pubsub-js';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[0]
    }
  }
  playMusic(musicItem) {
    $('#player').jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');

    this.setState({
      currentMusicItem: musicItem
    })
  }
  playNext(type = "next") {
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let newIndex = null;
    let musicListLength = this.state.musicList.length;
    if (type === 'next') {
      newIndex = (index + 1) % musicListLength;
    } else {
      newIndex = (index - 1 + musicListLength) % musicListLength;
    }
    this.playMusic(this.state.musicList[newIndex]);
  }
  findMusicIndex(musicItem) {
    return this.state.musicList.indexOf(musicItem);
  }
  componentDidMount() {
    // 使用jplayer来初始化音乐播放器
    // eslint-disable-next-line
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    });
    this.playMusic(this.state.currentMusicItem);
    $('#player').bind($.jPlayer.event.ended, (e) => {
      this.playNext();
    });
    Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
      this.setState({
        musicList: this.state.musicList.filter(item => {
          return item !== musicItem;
        })
      });
    });
    Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
      this.playMusic(musicItem);
    });
    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev');
    });
    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext();
    });
  }
  componentWillUnMount() {
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('DELETE_MUSIC');
    Pubsub.unsubscribe('PLAY_PREV');
    Pubsub.unsubscribe('PLAY_NEXT');
    $('#player').unbind($.jPlayer.event.ended);
  }
  render() {
    return (
      <Router history={HashRouter}>      
        <App>
          <Route path="/" exact render={(props) => <Player {...props} musicList={this.state.musicList} currentMusicItem={this.state.currentMusicItem} />}></Route>
          <Route path="/list" render={(props) => <MusicList {...props} musicList={this.state.musicList} currentMusicItem={this.state.currentMusicItem} />}></Route>
        </App>
      </Router>
    );
  }
};

export default Root;