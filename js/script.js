// Seleciona os elementos do DOM
const player = document.querySelector("#player");
const musicName = document.querySelector("#musicName");
const musicArtist = document.querySelector("#musicArtist");
const albumCover = document.querySelector("#albumCover");
const playPauseButton = document.querySelector("#playPauseButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const shuffleButton = document.querySelector("#shuffleButton");
const stopButton = document.querySelector("#stopButton");
const showPlaylistButton = document.querySelector("#showPlaylistButton"); // Botão para mostrar a playlist
const playlistContainer = document.querySelector("#playlistContainer"); // Contêiner da playlist
const musicList = document.querySelector("#musicList");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");

// Importa a lista de músicas de outro arquivo (songs.js)
import songs from "./songs.js";

// Define os ícones dos botões de play e pause
const textButtonPlay = '<i class="bi bi-play"></i>';
const textButtonPause = '<i class="bi bi-pause"></i>';

// Variáveis para controlar o estado do player
let index = 0; // Índice da música atual
let isShuffle = false; // Flag para controlar o modo aleatório


// Função para colocar em modo aleatório
shuffleButton.onclick = () => {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle('active', isShuffle); // Adiciona ou remove a classe 'active'
};

// Função para mostrar/ocultar a playlist
showPlaylistButton.onclick = () => {
  // Alterna a visibilidade da lista
  playlistContainer.style.display = playlistContainer.style.display === "none" ? "block" : "none";
  
  // Preenche a lista de músicas se ainda não foi preenchida
  if (musicList.innerHTML === "") {
    songs.forEach((song, i) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${song.name} - ${song.artist}`;
      listItem.addEventListener("click", () => {
        index = i;  // Atualiza o índice da música clicada
        loadMusic(); // Carrega a música e toca
      });
      musicList.appendChild(listItem); // Adiciona o item à lista
    });
  }
};

prevButton.onclick = () => prevNextMusic("prev"); // Música anterior
nextButton.onclick = () => prevNextMusic(); // Música seguinte

// Função para controlar o play e pause
playPauseButton.onclick = () => playPause();

const playPause = () => {
  if (player.paused) { // Se o player estiver pausado
    player.play(); // Toca a música
    playPauseButton.innerHTML = textButtonPause; // Altera o ícone para "pause"
  } else { // Se o player estiver tocando
    player.pause(); // Pausa a música
    playPauseButton.innerHTML = textButtonPlay; // Altera o ícone para "play"
  }
};

// Atualiza o tempo atual da música e a barra de progresso
player.ontimeupdate = () => updateTime();

// Adiciona o evento 'ended' para tocar a próxima música automaticamente
player.addEventListener('ended', () => {
  prevNextMusic('next');
});

// Função para atualizar o tempo e a barra de progresso
const updateTime = () => {
  const currentMinutes = Math.floor(player.currentTime / 60);  // Calcula os minutos
  const currentSeconds = Math.floor(player.currentTime % 60);  // Calcula os segundos
  currentTime.textContent = currentMinutes + ":" + formatZero(currentSeconds);  // Exibe o tempo atual

  const durationFormatted = isNaN(player.duration) ? 0 : player.duration;  // Se a duração for inválida, coloca 0
  const durationMinutes = Math.floor(durationFormatted / 60);  // Calcula os minutos da duração
  const durationSeconds = Math.floor(durationFormatted % 60);  // Calcula os segundos da duração
  duration.textContent = durationMinutes + ":" + formatZero(durationSeconds);  // Exibe a duração total

  const progressWidth = durationFormatted
    ? (player.currentTime / durationFormatted) * 100  // Calcula a porcentagem de progresso
    : 0;

  progress.style.width = progressWidth + "%";  // Atualiza a largura da barra de progresso
};

// Função para adicionar zero à esquerda, se necessário
const formatZero = (n) => (n < 10 ? "0" + n : n);

// Função para alterar o tempo ao clicar na barra de progresso
progressBar.onclick = (e) => {
  const newTime = (e.offsetX / progressBar.offsetWidth) * player.duration;  // Calcula o novo tempo com base na posição do clique
  player.currentTime = newTime;  // Atualiza o tempo da música
};

// Função para tocar a próxima ou a anterior música
const prevNextMusic = (type = "next") => {
  if (isShuffle && type === "next") {  // Se o modo aleatório estiver ativado
    let randomIndex;  // Variável para o índice aleatório
    do {
      randomIndex = Math.floor(Math.random() * songs.length);  // Escolhe um índice aleatório
    } while (randomIndex === index);  // Garante que não seja a mesma música
    index = randomIndex;  // Atualiza o índice com o índice aleatório
  } else {  // Se o modo aleatório não estiver ativado, segue a sequência
    if ((type == "next" && index + 1 === songs.length) || type === "init") {
      index = 0;  // Se chegar no final, volta para a primeira música
    } else if (type == "prev" && index === 0) {
      index = songs.length - 1;  // Se estiver na primeira música, vai para a última
    } else {
      index = type === "prev" && index ? index - 1 : index + 1;  // Caso contrário, vai para a anterior ou seguinte
    }
  }

  loadMusic();  // Carrega a nova música
};

// Função para carregar e tocar a música
const loadMusic = () => {
  player.src = songs[index].src;  // Define o arquivo de áudio da música
  musicName.innerHTML = songs[index].name;  // Exibe o nome da música
  musicArtist.innerHTML = songs[index].artist;  // Exibe o nome do artista
  albumCover.src = songs[index].album;  // Exibe a capa do álbum

  updatePlaylist();  // Atualiza a lista de músicas destacando a música atual

  player.play();  // Toca a música
};

// Função para atualizar a playlist com a música atual
const updatePlaylist = () => {
  const items = musicList.querySelectorAll("li");  // Seleciona todos os itens da lista
  items.forEach((item, i) => {
    item.classList.remove('playing');  // Remove a classe 'playing' de todos os itens
    if (i === index) {
      item.classList.add('playing');  // Adiciona a classe 'playing' ao item da música atual
    }
  });
};

// Função para carregar a lista de músicas no player
const loadPlaylist = () => {
  songs.forEach((song, i) => {
    const listItem = document.createElement("li");  // Cria um item na lista
    listItem.textContent = `${song.name} - ${song.artist}`;  // Adiciona o nome e artista
    listItem.addEventListener("click", () => {
      index = i;  // Atualiza o índice da música clicada
      loadMusic();  // Carrega e toca a música
    });
    musicList.appendChild(listItem);  // Adiciona o item à lista
  });
};

// Inicializa a playlist e carrega a primeira música
loadPlaylist();
loadMusic();

// Função para parar a música
stopButton.onclick = () => {
  player.pause();            // Pausa a música
  player.currentTime = 0;     // Volta ao início da música
  playPauseButton.innerHTML = textButtonPlay;  // Altera o ícone do botão para "play"
};