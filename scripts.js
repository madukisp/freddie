$(document).ready(function() {
    const audioElement = document.getElementById("audio");
    const imagemElement = document.getElementById("imagem");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    audioElement.addEventListener("canplay", function() {
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 32; // Reduza para obter valores de frequência mais baixos
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;

            const scaleFactor = 0.005; // Ajuste para controlar o tamanho da pulsação
            const scale = 1 + average * scaleFactor;

            imagemElement.style.transform = `scale(${scale})`;
        }

        renderFrame();
    });
});


$(document).ready(function() {
    // Adiciona evento "click" aos links de música
    $(".music-link").click(function(event) {
        event.preventDefault(); // Previne comportamento padrão do link
        var musicLink = $(this).attr("href"); // Obtém link da música
        var videoHtml = '<video controls><source src="' + musicLink + '"></video>'; // Cria elemento de vídeo com o link da música
        $(".music-player").html(videoHtml); // Atualiza o conteúdo do player de música com o elemento de vídeo
        const player = new Plyr('.music-player video'); // Cria um novo player com Plyr
        player.play(); // Toca o vídeo
    });

    // Adiciona evento "submit" ao formulário de inserção de link
    $(".link-form").submit(function(event) {
        event.preventDefault(); // Previne comportamento padrão do formulário
        var musicLink = $(this).find("input").val(); // Obtém o link inserido pelo usuário
        var musicName = $(this).attr("data-music-name"); // Obtém o nome da música correspondente
        $(".music-link:contains('" + musicName + "')").attr("href", musicLink); // Atualiza o atributo "href" do link de música correspondente
    });
});
