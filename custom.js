const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PlAYER_STORAGE_KEY = "F5_PLAYER";
const heading = $("header h2");
const thumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playButton = $(".btn-toggle-play");
const Player = $(".player");
const time = $("#time");
const volume = $("#volume");
const redoButton = $(".btn-repeat");
const nextButton = $(".btn-next");
const prevButton = $(".btn-prev");
const randomButton = $(".btn-random");
const playList = $(".playlist");
const activeSong = $(".song.active");
toMMSS = function (sec_num) {
  var minutes = Math.floor(sec_num / 60);
  var seconds = sec_num - minutes * 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
};
const app = {
  currentIndex: 0,
  isRandom: false,
  isPlaying: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Anh Tự Do Nhưng Cô Đơn",
      singer: "Ba Rọi Béo x Trung Quân",
      path: "assets/music/3roi.mp3",
      image: "assets/image/beoj.jpg",
    },
    {
      name: "Em Trang Trí",
      singer: "Ngọt",
      path: "assets/music/y2mate.com - Em Trang Trí.mp3",
      image: "assets/image/download.jfif",
    },
    {
      name: "Bạn thỏ tivi nhỏ",
      singer: "Raftaar x Brobha V",
      path: "assets/music/y2mate.com - Bạn thỏ tivi nhỏ.mp3",
      image: "assets/image/download.jfif",
    },
    {
      name: "Mấy Khi",
      singer: "Ngọt",
      path: "assets/music/y2mate.com - Mấy Khi.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Đêm Hôm Qua",
      singer: "Ngọt",
      path: "assets/music/y2mate.com - Đêm Hôm Qua.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Em Trong Đầu",
      singer: "Raftaar x kr$na",
      path: "assets/music/y2mate.com - Em Trong Đầu.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
    },
    {
      name: "Mất Tích",
      singer: "Raftaar x Harjas",
      path: "assets/music/y2mate.com - Mất Tích.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  setConfig: function (key, value) {
    this.config[key] = value;

    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index == this.currentIndex ? "active" : ""
      }" data-index ="${index}">
      <div
        class="thumb"
        style="
          background-image: url('${song.image}');
        "
      ></div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`;
    });
    $(".playlist").innerHTML = htmls.join("\n");
  },

  loadCurrentSong: function () {
    heading.innerHTML = this.currentSong.name;
    thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    this.render();
    this.scrollToActiveSong();
  },
  loadTime: function () {
    $(".current-time").innerHTML = toMMSS(Math.floor(audio.currentTime));
    $(".duration-time").innerHTML = toMMSS(Math.floor(audio.duration));
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    if (app.isRandom) {
      app.randomSong();
    } else {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
      audio.play();
    }
  },
  prevSong: function () {
    if (app.isRandom) {
      app.randomSong();
    } else {
      this.currentIndex--;
      if (this.currentIndex <= -1) {
        this.currentIndex = this.songs.length;
      }
      this.loadCurrentSong();
      audio.play();
    }
  },
  randomSong: function () {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (randomIndex === this.currentIndex);

    this.currentIndex = randomIndex;
    this.loadCurrentSong();
    audio.play();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // Xoay CD
    const cdThumbAnimate = thumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    // Xử lí khi play
    playButton.onclick = function () {
      if (_this.isPlaying === false) {
        audio.play();
        Player.classList.add("playing");
        cdThumbAnimate.play();
        _this.isPlaying = true;
      } else {
        audio.pause();
        Player.classList.remove("playing");
        cdThumbAnimate.pause();
        _this.isPlaying = false;
      }
    };

    // Xử lí thanh chạy
    audio.ontimeupdate = function () {
      _this.loadTime();
      if (audio.duration) {
        time.value = (audio.currentTime / audio.duration) * 100;
      }
      if (audio.currentTime == audio.duration) {
        if (_this.isRepeat) {
          // app.currentTime = 0;
          audio.play();
        } else {
          app.nextSong();
        }
      }
    };
    // Click vào thanh chạy
    time.oninput = function () {
      audio.currentTime = (time.value / 100) * audio.duration;
    };
    // Click vào thanh voulume
    volume.oninput = function () {
      audio.volume = volume.value / 100;
    };

    // Xử lí tua lại bài hát
    redoButton.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      redoButton.classList.toggle("active", _this.isRepeat);
    };
    //Xử lí tải bài hát tiếp theo
    nextButton.onclick = function () {
      app.nextSong();
    };
    // Xử lí tải bài hát trước đó
    prevButton.onclick = function () {
      app.prevSong();
    };
    randomButton.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomButton.classList.toggle("active", _this.isRandom);
    };
    // Xử lí khi bấm vào bài hát
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode && !e.target.closest(".option")) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
    };
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();
    // Định nghĩa thuộc tính
    this.defineProperties();
    // Xử lí sự kiện
    this.handleEvents();
    // Chạy bài hát
    this.loadCurrentSong();

    // Render playlist
    this.render();
    // Hiển thị trạng thái ban đầu của button repeat & random

    randomButton.classList.toggle("active", this.isRandom);
    redoButton.classList.toggle("active", this.isRepeat);
  },
};
app.start();
