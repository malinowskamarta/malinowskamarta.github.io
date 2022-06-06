import { styles } from './scss/index.scss'
import { initializeUsersTab, initializeCollectionsTab, initializePhotosTab, initializeTabs } from './js/components/tabs'

initializeTabs('#my-js-tabs', [initializePhotosTab, initializeCollectionsTab, initializeUsersTab]);

