import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
	selector: 'app-root',
	imports: [],
	templateUrl: './app.html',
	styleUrl: './app.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected readonly title = signal('Eslint-Prettier-Husky');

	public x = 1;

	public test(): number {
		return this.x;
	}
}
