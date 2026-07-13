function inverseMousePosition(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return {
    x1: -(x - rect.width / 2) / 20,
    y1: -(y - rect.height / 2) / 20,
    x2: -(x - rect.width / 2) / 20,
    y2: (y - rect.height / 2) / 20,
    x3: (x - rect.width / 2) / 20,
    y3: -(y - rect.height / 2) / 20,
    x4: (x - rect.width / 2) / 20,
    y4: (y - rect.height / 2) / 20
  };
}

function initNavbar() {
  const nav = document.querySelector('.nav');

  if (!nav) {
    return;
  }

  const links = Array.from(nav.querySelectorAll('li a'));
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const sectionItems = links
    .map((link) => {
      const href = link.getAttribute('href') || '';
      const id = href.startsWith('#') ? href.slice(1) : '';
      const element = id ? document.getElementById(id) : null;

      return { link, id, element };
    })
    .filter((item) => item.element);

  let activeSectionId = 'home';
  let frameRequested = false;

  const setTheme = (sectionId) => {
    const isHeroSection = sectionId === 'home';

    nav.classList.toggle('nav-theme-dark', isHeroSection);
    nav.classList.toggle('nav-theme-light', !isHeroSection);
  };

const navList = nav.querySelector('ul');

const updateIndicator = (targetItem) => {
  const targetRect = targetItem.getBoundingClientRect();
  const navListRect = navList.getBoundingClientRect();

  const position = targetRect.left - navListRect.left;

  nav.style.setProperty('--after-bg-position', position);

  nav.style.setProperty(
    '--after-radial-bg-position',
    position + targetRect.width / 2
  );

  nav.style.setProperty('--after-bg-width', targetRect.width);
};

  const setActiveSection = (sectionId, animateIndicator = true) => {
    const matchedItem = sectionItems.find((item) => item.id === sectionId);

    if (!matchedItem) {
      return;
    }

    const targetItem = matchedItem.link.parentElement;
    const currentActiveItem = nav.querySelector('li.active');

    if (currentActiveItem && currentActiveItem !== targetItem) {
      currentActiveItem.classList.remove('active');
    }

    targetItem.classList.add('active');
    activeSectionId = sectionId;
    setTheme(sectionId);

    if (!animateIndicator || !currentActiveItem || currentActiveItem === targetItem) {
      updateIndicator(targetItem);
      return;
    }


    updateIndicator(currentActiveItem);

    requestAnimationFrame(() => {
      updateIndicator(targetItem);
    });
  };

  const previewHover = (sectionId) => {
    const matchedItem = sectionItems.find((item) => item.id === sectionId);

    if (!matchedItem) {
      return;
    }

    updateIndicator(matchedItem.link.parentElement);
  };

  const clearHoverPreview = () => {
    const activeLink = nav.querySelector('li.active a');

    if (activeLink) {
      const activeItem = activeLink.parentElement;
      updateIndicator(activeItem);
    }
  };

  const updateActiveSectionFromScroll = () => {
    if (frameRequested) {
      return;
    }

    frameRequested = true;

    window.requestAnimationFrame(() => {
      frameRequested = false;

      const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--section-offset')) || 96;
      const scrollPosition = window.scrollY + navOffset;

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActiveSection('contact', true);
        return;
      }

      let closestId = 'home';
      let closestDistance = Infinity;

      sectionItems.forEach((item) => {
        if (!item.element) {
          return;
        }

        const sectionTop = item.element.offsetTop;
        const distance = Math.abs(sectionTop - scrollPosition);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = item.id;
        }
      });

      if (closestId !== activeSectionId) {
        setActiveSection(closestId, true);
      } else {
        const activeItem = nav.querySelector('li.active');

        if (activeItem) {
          updateIndicator(activeItem);
        }
      }
    });
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const href = link.getAttribute('href') || '';
      const sectionId = href.startsWith('#') ? href.slice(1) : '';
      const targetSection = sectionId ? document.getElementById(sectionId) : null;

      setActiveSection(sectionId, true);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    });

    if (supportsHover) {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href') || '';
        const sectionId = href.startsWith('#') ? href.slice(1) : '';

        if (sectionId) {
          previewHover(sectionId);
        }
      });

      link.addEventListener('mouseleave', () => {
        clearHoverPreview();
      });
    }

    link.addEventListener('mousemove', (event) => {
      const tilt = inverseMousePosition(event.target, event);

      nav.style.setProperty('--tilt-bg-y', tilt.x1 * 2);
      nav.style.setProperty('--tilt-bg-x', tilt.y1 * 2);
    });
  });

  window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true });
  window.addEventListener('resize', updateActiveSectionFromScroll);

  const hashSectionId = window.location.hash ? window.location.hash.slice(1) : 'home';
  const initialMatch = sectionItems.find((item) => item.id === hashSectionId);

  if (initialMatch) {
    setActiveSection(initialMatch.id, false);
  } else {
    setActiveSection('home', false);
  }

  updateActiveSectionFromScroll();
}

window.addEventListener('DOMContentLoaded', initNavbar);