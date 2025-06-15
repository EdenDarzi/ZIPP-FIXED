
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Brain, Lightbulb } from 'lucide-react';

interface TriviaChallengeCardProps {
  imageUrl: string;
  imageHint: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  onTriviaComplete: () => void;
}

export function TriviaChallengeCard({
  imageUrl,
  imageHint,
  questionText,
  options,
  correctAnswer,
  onTriviaComplete,
}: TriviaChallengeCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();

  const handleSubmitGuess = () => {
    if (!selectedOption) {
      toast({
        title: 'לא נבחרה תשובה',
        description: 'אנא בחר/י אחת מהאפשרויות.',
        variant: 'destructive',
      });
      return;
    }

    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      toast({
        title: 'כל הכבוד!',
        description: '+5 נקודות XP התווספו לחשבונך (דמו).',
        variant: 'default',
        className: 'bg-green-500 text-white',
      });
    } else {
      toast({
        title: 'אופס, תשובה לא נכונה',
        description: 'נסה/י שוב בפעם הבאה!',
        variant: 'destructive',
      });
    }
    onTriviaComplete(); // Notify parent that trivia is done for this session
  };

  return (
    <Card className="shadow-xl animate-fadeInUp bg-muted/30">
      <CardHeader className="items-center text-center">
        <Lightbulb className="h-10 w-10 text-yellow-400 mb-2" />
        <CardTitle className="text-2xl font-headline text-primary">{questionText}</CardTitle>
        <CardDescription>השליח בדרך! בדוק/י את הידע שלך בינתיים.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-primary/20 shadow-inner">
          <Image
            src={imageUrl}
            alt="תמונת חידון אוכל"
            layout="fill"
            objectFit="cover"
            data-ai-hint={imageHint}
          />
        </div>

        {!isAnswered ? (
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-2" dir="rtl">
            {options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className="flex items-center p-3 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-all"
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="ml-3" /> {/* Adjusted margin for RTL */}
                {option}
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <div className={`p-4 rounded-md text-center text-lg font-semibold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 mb-2" />
                <p>תשובה נכונה! כל הכבוד!</p>
                <p className="text-sm">+5 נקודות XP (דמו)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="h-8 w-8 mb-2" />
                <p>תשובה לא נכונה.</p>
                <p className="text-sm">התשובה הנכונה הייתה: {correctAnswer}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!isAnswered && (
        <CardFooter>
          <Button onClick={handleSubmitGuess} className="w-full bg-primary hover:bg-primary/90 text-lg" disabled={!selectedOption}>
            <Brain className="ml-2 h-5 w-5" /> שלח ניחוש
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
