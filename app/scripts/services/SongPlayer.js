(function () {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

// Private attributes
    
    /**
     * @desc Buzz object audio file
     * @type {Object}
     */
    var currentBuzzObject = null;
    
    /**
     * @desc To access album information
     * @type {Object}
     */
    var currentAlbum = Fixtures.getAlbum();

// Private functions

    /**
     * @function setSong
     * @desc Stops currently playing song and loads new audio file as currentBuzzObject
     * @param {Object} song
     */
    var setSong = function (song) {
      if (currentBuzzObject) {
        stopSong(song);
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });
        
      currentBuzzObject.bind('timeupdate', function() {
         $rootScope.$apply(function() {
             SongPlayer.currentTime = currentBuzzObject.getTime();
         });
     });

      SongPlayer.currentSong = song;
    };
    
    /**
     * @function playSong
     * @desc Plays song and sets property to true
     * @param {Object} song
     */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
      }
    
    var stopSong = function(song) {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    }
    
    /**
     * @desc Get the index of song
     * @param {Object} song
     */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };
    
// Public attributes
    
    SongPlayer.currentSong = null;
     /**
      * @desc Current playback time (in seconds) of currently playing song
      * @type {Number}
      */
    SongPlayer.currentTime = null;
      
    /**
     * @desc Sets volume on song
     * @type {Number}
     */
    
    SongPlayer.volume = null;
  
    
// Public methods
      
      /**
      * @function play
      * @desc Play current or new song
      * @param {Object} song
      */
      
    SongPlayer.play = function (song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);

      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
           playSong(song);
        }

      }

    };
      /**
      *@function pause
      *@desc Pause currentsong
      *@param {Object} song
      */

    SongPlayer.pause = function (song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
     * @desc A method to go to prevous song
     * @param {Object}
     */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
    } else {
      var song = currentAlbum.songs[currentSongIndex];
      setSong(song);
      playSong(song);
    }
    };
      
     /**
     * @desc A method to go to next song
     * @param {Object}
     */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex >= currentAlbum.songs.length) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };
      
       /**
      * @function setCurrentTime
      * @desc Set current time (in seconds) of currently playing song
      * @param {Number} time
      */
    SongPlayer.setCurrentTime = function(time) {
       if (currentBuzzObject) {
         currentBuzzObject.setTime(time);
      }
   };
      
     SongPlayer.volume = function(volume) {
      if(currentBuzzObject) {
          currentBuzzObject.setVolume(volume);
      }
  };    
    
    return SongPlayer;
  }
    
   
    
  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope','Fixtures', SongPlayer]);
})();