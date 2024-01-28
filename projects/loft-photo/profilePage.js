import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {
    const photoComp = document.querySelector('.component-user-info-photo'),
      nameComp = document.querySelector('.component-user-info-name'),
      photosComp = document.querySelector('.component-user-photos'),
      photos = await model.getPhotos(user.id);

    this.user = user;

    photoComp.style.backgroundImage = `url('${user.photo_100}')`;
    nameComp.innerText = `${user.first_name ?? ''} ${user.last_name ?? ''}`;
    photosComp.innerHTML = '';

    for (const photo of photos.items) {
      const size = model.findSize(photo),
        element = document.createElement('div');

      element.classList.add('component-user-photo');
      element.dataset.id = photo.id;
      element.dataset.url = size.url;
      element.style.backgroundImage = `url('${size.url}')`;
      photosComp.append(element);
    }
  },

  handleEvents() {
    document
      .querySelector('.component-user-photos')
      .addEventListener('click', async (e) => {
        if (e.target.classList.contains('component-user-photo')) {
          // console.log(e.target);
          const photoId = e.target.dataset.id,
            url = e.target.dataset.url;

          mainPage.setFriendAndPhoto(this.user, parseInt(photoId), url);
          pages.openPage('main');
        }
      });

    document.querySelector('.page-profile-back').addEventListener('click', async () => {
      pages.openPage('main');
    });

    document.querySelector('.page-profile-exit').addEventListener('click', async () => {
      await model.logout();
      pages.openPage('login');
    });
  },
};
