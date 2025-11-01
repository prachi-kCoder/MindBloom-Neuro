-- Create learning_materials table to store uploaded content
CREATE TABLE public.learning_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT,
  age_group TEXT,
  disability_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audio_assessments table for audio submissions
CREATE TABLE public.audio_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  material_id UUID REFERENCES public.learning_materials(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  transcription TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_materials
CREATE POLICY "Users can view their own materials"
ON public.learning_materials
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own materials"
ON public.learning_materials
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials"
ON public.learning_materials
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials"
ON public.learning_materials
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for audio_assessments
CREATE POLICY "Users can view their own assessments"
ON public.audio_assessments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments"
ON public.audio_assessments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments"
ON public.audio_assessments
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-assessments', 'audio-assessments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audio assessments
CREATE POLICY "Users can upload their own audio"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'audio-assessments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own audio"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'audio-assessments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own audio"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'audio-assessments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_learning_materials_updated_at
BEFORE UPDATE ON public.learning_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();