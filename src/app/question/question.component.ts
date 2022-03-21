import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: String = '';
  public questionList: any = {};
  public List : any = []
  public currentQuestion: number = 0;
  public points: number = 0;

  counter = 60;
  correctAnswer:number = 0;
  incorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  
  isQuizCompleted: boolean = false;


  constructor( private _questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
  }

  getAllQuestion(){
    this._questionService.getQuestionJson()
      .subscribe( res =>{
        this.questionList = res;
        this.List = this.questionList.questions;
      });
  }

  nextQuestion(): void{
    this.currentQuestion++;
  }

  prevQuestion(): void{
    this.currentQuestion--;

  }

  answer(currentQno:number, option:any):void{
      if(currentQno === this.List.length){
        this.isQuizCompleted = true;
        this.stopCounter();
      }
      if(option.correct){
        this.points+=10;
        this.correctAnswer++;
        setTimeout(()=>{
          this.currentQuestion++;
          this.resetCounter();
          this.getProgress();
        },1000)
      }else{
        setTimeout(()=>{
          this.incorrectAnswer++;
          this.currentQuestion++;
          this.getProgress();
        },1000)
        this.points-=10;
      
      }
  }

  startCounter(){
    this.interval$ = interval(1000)
      .subscribe(val=>{
        this.counter--;
        if(this.counter === 0){
          this.currentQuestion++;
          this.counter =60;
          this.points-=10;
        }
      });
      setTimeout(()=>{
        this.interval$.unsubscribe();
      },600000)
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestion();
    this.progress ="0"
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
  }
  
  getProgress(): string{
    this.progress = ((this.currentQuestion/this.List.length)*100).toString();
    return this.progress;
  }
}
