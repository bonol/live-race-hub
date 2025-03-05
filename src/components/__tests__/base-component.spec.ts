import Component from "../base-component";

class TestComponent extends Component<HTMLDivElement, HTMLParagraphElement>{
    configure(): void {}
    renderContent(): void {}
}

describe('Base Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <template id="test">
                <p>Test Component</p>
            </template>
            <template id="test-last">
                <p>Last Test Component</p>
            </template>
            <div id='test-host'></div>
        `;
    });

    it('should render base component', () => {
        new TestComponent('test', 'test-host', true, 'test-element');
        const newElement = document.getElementById('test-element')!;

        expect(newElement).not.toBeNull();
        expect(newElement.tagName).toBe('P');
        expect(newElement.textContent).toContain('Test Component');
    });

    it('should insert the element at the begining if insertAtStart is true', () => {
        new TestComponent('test', 'test-host', true, 'test-element');
        const hostElement =  document.getElementById('test-host')!;
        const firstChild = hostElement.firstElementChild as HTMLParagraphElement;

        expect(firstChild.id).toBe('test-element');
    });

    it('should insert the element at the end if insertAtStart is false', () => {
        new TestComponent('test', 'test-host', true, 'test-element');
        new TestComponent('test-last', 'test-host', false, 'test-last');

        const hostElement =  document.getElementById('test-host')!;
        const firstChild = hostElement.firstElementChild as HTMLParagraphElement;
        const lastChild = hostElement.lastElementChild as HTMLParagraphElement;

        expect(firstChild.id).toBe('test-element');
        expect(lastChild.id).toBe('test-last');
    });
});