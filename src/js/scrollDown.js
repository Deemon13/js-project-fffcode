const body = document.querySelector('footer');
const scrollBtn = document.querySelector('.scroll-btn');
document.addEventListener('scroll', handleScroll);

function handleScroll() {
  const scrollableHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;

  if (document.documentElement.scrollTop / scrollableHeight > 0) {
    if (!scrollBtn.classList.contains('show-scroll-btn') && !body.classList.contains('is-open'))
      scrollBtn.classList.add('show-scroll-btn');
  } else {
    if (scrollBtn.classList.contains('show-scroll-btn'))
      scrollBtn.classList.remove('show-scroll-btn');
  }
}

const scrollToTop = () => window.scrollTo({ top: 100000, behavior: 'smooth' });

scrollBtn.addEventListener('click', scrollToTop);
