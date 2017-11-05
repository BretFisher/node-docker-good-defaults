import { h, Component } from 'preact';
import { route } from 'preact-router';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
import style from './style';

export default class Header extends Component {
	closeDrawer(){
		this.drawer.MDComponent.open = false;
		this.state = {
			darkThemeEnabled: false
		};
	}
	render() {
		return (
			<div>
				<Toolbar className="toolbar">
					<Toolbar.Row>
						<Toolbar.Section align-start={true}>
							<Toolbar.Icon menu={true} onClick={() => {
								this.drawer.MDComponent.open = true;
							}}>menu</Toolbar.Icon>
							<Toolbar.Title>
								Preact app
							</Toolbar.Title>
						</Toolbar.Section>
						<Toolbar.Section align-end={true} onClick={()=>{
							this.dialog.MDComponent.show();
						}}>
							<Toolbar.Icon>settings</Toolbar.Icon>
						</Toolbar.Section>
					</Toolbar.Row>
				</Toolbar>
				<Drawer.TemporaryDrawer ref={drawer=>{this.drawer = drawer;}} >
					<Drawer.TemporaryDrawerContent>
						<List>
							<List.LinkItem onClick={()=>{route('/'); this.closeDrawer();}}>
								<List.ItemIcon>home</List.ItemIcon>
									Home
							</List.LinkItem>
							<List.LinkItem onClick={()=>{route('/profile'); this.closeDrawer();}}>
								<List.ItemIcon>account_circle</List.ItemIcon>
									Profile
							</List.LinkItem>
						</List>
					</Drawer.TemporaryDrawerContent>
				</Drawer.TemporaryDrawer>
				<Dialog ref={dialog=>{this.dialog=dialog;}}>
          <Dialog.Header>Settings</Dialog.Header>
          <Dialog.Body>
						<div>
							Enable dark theme <Switch onClick={()=>{
								this.setState({
									darkThemeEnabled: !this.state.darkThemeEnabled
								},() => {
									if(this.state.darkThemeEnabled) {
										document.body.classList.add('mdc-theme--dark');
									} else {
										document.body.classList.remove('mdc-theme--dark');
									}
								});
							}}/>
						</div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterButton accept={true}>okay</Dialog.FooterButton>
          </Dialog.Footer>
        </Dialog>
			</div>
		);
	}
}
