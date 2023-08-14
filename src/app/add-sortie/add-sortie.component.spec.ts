import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSortieComponent } from './add-sortie.component';

describe('AddSortieComponent', () => {
  let component: AddSortieComponent;
  let fixture: ComponentFixture<AddSortieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSortieComponent]
    });
    fixture = TestBed.createComponent(AddSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
