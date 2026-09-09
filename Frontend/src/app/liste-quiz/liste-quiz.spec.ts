import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeQuiz } from './liste-quiz';

describe('ListeQuiz', () => {
  let component: ListeQuiz;
  let fixture: ComponentFixture<ListeQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeQuiz],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeQuiz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
