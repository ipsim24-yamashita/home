async function loadAudios() {
  const container = document.getElementById('video-container');

  try {
    const response = await fetch('./ipsim_BGM.json');
    const audios = await response.json();

    audios.forEach((audio) => {
      const card = document.createElement('div');
      card.className =
        'bg-white shadow rounded-xl overflow-hidden transition hover:shadow-lg text-center p-4';

      card.innerHTML = `
        <h3 class="font-semibold text-lg text-gray-700 mb-2">${audio.title}</h3>
        <p class="text-sm text-gray-600 mb-4">${audio.grade}・${audio.subject}</p>
        <audio controls loop autoplay class="mx-auto w-full max-w-[300px]">
          <source src="${audio.url}" type="audio/mpeg">
          お使いのブラウザはaudioタグに対応していません。
        </audio>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p class="text-center text-red-600">BGMリストの読み込みに失敗しました。</p>`;
    console.error(err);
  }
}

loadAudios();
