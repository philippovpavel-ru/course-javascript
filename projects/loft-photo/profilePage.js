import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {
    const photoComp = document.querySelector('.component-user-info-photo'),
      nameComp = document.querySelector('.component-user-info-name'),
      photosCompMode = document.querySelector('.component-user-mode-photos'),
      friendsCompMode = document.querySelector('.component-user-mode-friends'),
      activeMode = localStorage.getItem('user-profile-active-mode') ?? 'mode-photos';

    this.user = user;

    photoComp.style.backgroundImage = `url('${user.photo_100}')`;
    nameComp.innerText = `${user.first_name ?? ''} ${user.last_name ?? ''}`;

    photosCompMode.click();

    if (activeMode === 'mode-friends') {
      friendsCompMode.click();
    }
  },

  async showPhotos() {
    const photosComp = document.querySelector('.component-user-photos'),
      photos = await model.getPhotos(this.user.id);

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

  async showFriends() {
    const friendsComp = document.querySelector('.component-user-friends'),
      friends = await model.getFriends(this.user.id);

    friendsComp.innerHTML = '';

    for (const friend of friends.items) {
      const element = document.createElement('div'),
        friendPhoto = document.createElement('div'),
        friendName = document.createElement('div');

      element.classList.add('component-user-friend');
      element.dataset.id = friend.id;

      friendPhoto.classList.add('component-user-friend');
      friendPhoto.dataset.id = friend.id;
      friendPhoto.style.backgroundImage = `url('${friend.photo_100}')`;

      friendName.classList.add('component-user-friend-name');
      friendName.dataset.id = friend.id;
      friendName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;

      element.append(friendPhoto, friendName);
      friendsComp.append(element);
    }
  },

  handleEvents() {
    const prevPage = document.querySelector('.page-profile-back'),
      logout = document.querySelector('.page-profile-exit'),
      userPhotos = document.querySelector('.component-user-photos'),
      userFriends = document.querySelector('.component-user-friends'),
      userPhotosBTN = document.querySelector('.component-user-mode-photos'),
      userFriendsBTN = document.querySelector('.component-user-mode-friends');

    userPhotosBTN.addEventListener('click', () => {
      if (!userFriends.classList.contains('hidden')) {
        userFriends.classList.add('hidden');
      }

      this.showPhotos();
      localStorage.setItem('user-profile-active-mode', 'mode-photos');
      userPhotos.classList.remove('hidden');
    });

    userFriendsBTN.addEventListener('click', () => {
      if (!userPhotos.classList.contains('hidden')) {
        userPhotos.classList.add('hidden');
      }

      this.showFriends();
      localStorage.setItem('user-profile-active-mode', 'mode-friends');
      userFriends.classList.remove('hidden');
    });

    userFriends.addEventListener('click', async (e) => {
      const friendID = e.target.dataset.id;

      if (friendID) {
        const [friend] = await model.getUsers([friendID]),
          friendPhotos = await model.getPhotos(friendID),
          photo = model.getRandomElement(friendPhotos.items),
          size = model.findSize(photo),
          stats = await model.photoStats(photo.id);

        mainPage.setFriendAndPhoto(friend, photo.id, size.url, stats);
        pages.openPage('main');
      }
    });

    userPhotos.addEventListener('click', async (e) => {
      if (e.target.classList.contains('component-user-photo')) {
        const photoId = e.target.dataset.id,
          url = e.target.dataset.url,
          photoStats = await model.photoStats(photoId);

        mainPage.setFriendAndPhoto(this.user, parseInt(photoId), url, photoStats);
        pages.openPage('main');
      }
    });

    prevPage.addEventListener('click', async () => {
      pages.openPage('main');
    });

    logout.addEventListener('click', async () => {
      await model.logout();
      pages.openPage('login');
    });
  },
};
