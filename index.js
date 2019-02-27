const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow, addWindow;

app.on('ready', () => { 
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on('closed', () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Tee Money'
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on('closed', () => {
		addWindow = null;
	});
}

ipcMain.on('addTodo', (event, todo) => {
	mainWindow.webContents.send('addTodo', todo);	
	addWindow.close();
});

const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				accelerator: process.platform === 'darwin' ? 'command+w' : 'ctrl+w',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear Tasks',
				click() {
					mainWindow.webContents.send('clearTasks');
				}
			},
			{ 
				label: 'Quit',
				accelerator: process.platform === 'darwin' ? 'Command+q' : 'Ctrl+q',
				click() {
					app.quit();
				}
			}

		]
	}
];

if(process.platform === 'darwin') {
	menuTemplate.unshift();
}

if(process.env.NODE_ENV !== 'production') {
	menuTemplate.push(
		{
			label: 'DEVELOPER',
			submenu: [
				{
					role: 'reload'
				},
				{  
					label: 'Toggle Developer Tools',
					accelerator: process.platform === 'darwin' ? 'command+i' : 'ctrl+i',
					click(item, focusedWindow) {
						focusedWindow.toggleDevTools();	
					}
				}
			]
		}
	);
}

