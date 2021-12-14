const footer = document.querySelector('footer');
const scrollBtnD = document.querySelector('.scroll-btn-down');
document.addEventListener('scroll', handleScrollD);

function handleScrollD() {
  const scrollableHeightD =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;

  if (document.documentElement.scrollTop / scrollableHeightD > 0) {
    if (!scrollBtnD.classList.contains('show-scroll-btn-down') && !footer.classList.contains('is-open'))
      scrollBtnD.classList.add('show-scroll-btn-down');
  } else {
    if (scrollBtnD.classList.contains('show-scroll-btn-down'))
      scrollBtnD.classList.remove('show-scroll-btn-down');
  }
}

const scrollDown = () => window.scrollTo({ top: 100000, behavior: 'smooth' });

scrollBtnD.addEventListener('click', scrollDown);
