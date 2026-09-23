import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Ruler, 
  Scan, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  LayoutGrid,
  Info,
  ChevronRight,
  Eye,
  Camera,
  Upload,
  ScanLine
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { useSession } from '../context/SessionContext';
import { 
  RoomData, 
  DimensionUnit, 
  AreaDisplayUnit, 
  inferRoomSpaceType, 
  SavedRoomRecord 
} from '../types';
import { DimensionParser } from '../utils/dimensionParser';
import { DimensionScanParser } from '../utils/dimensionScanParser';
import { SAMPLE_FLOOR_PLANS, SampleFloorPlan } from '../data/sampleFloorPlans';
import { RoomCard } from '../components/RoomCard';
import { ScanRoomCard } from '../components/ScanRoomCard';
import { AddIndividualRoomModal } from '../components/AddIndividualRoomModal';
import { OcrDimensionReviewModal, PendingRoomPair } from '../components/OcrDimensionReviewModal';

interface YourMeasurementsViewProps {
  onBack: () => void;
  onContinue: () => void;
}

type StepMode = 'selection' | 'manual' | 'scan';

export const YourMeasurementsView: React.FC<YourMeasurementsViewProps> = ({ onBack, onContinue }) => {
  const { verificationDraft, setVerificationDraft, displayUnit } = useSession();

  const [mode, setMode] = useState<StepMode>('selection');
  const [rooms, setRooms] = useState<RoomData[]>(() => {
    if (verificationDraft?.rooms) {
      return verificationDraft.rooms.map((r, i) => ({
        id: (r as any).id || `room_${Date.now()}_${i}`,
        name: r.name,
        lengthMeters: r.lengthMeters,
        widthMeters: r.widthMeters,
        unit: (r.unit as DimensionUnit) || (displayUnit === 'metric' ? 'meterCm' : 'feetInches'),
        isAutoExtracted: r.source === 'ocr_scan',
        isUserVerified: r.isUserVerified,
        sourcePairId: r.sourcePairId,
        spaceType: r.spaceType
      }));
    }
    return [];
  });

  // OCR Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatusText, setOcrStatusText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Modals
  const [isAddIndividualModalOpen, setIsAddIndividualModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [pendingPairs, setPendingPairs] = useState<PendingRoomPair[]>([]);
  const [extractedRawText, setExtractedRawText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync rooms to verificationDraft
  useEffect(() => {
    const savedRooms: SavedRoomRecord[] = rooms.map(r => ({
      name: r.name,
      lengthMeters: r.lengthMeters,
      widthMeters: r.widthMeters,
      unit: r.unit,
      isUserVerified: r.isUserVerified,
      source: r.isAutoExtracted ? 'ocr_scan' : 'manual_entry',
      sourcePairId: r.sourcePairId,
      spaceType: r.spaceType || inferRoomSpaceType(r.name)
    }));

    // Calculate Usable Area for the draft (sum of all verified rooms)
    let totalUsableSqFt = 0;
    rooms.filter(r => r.isUserVerified).forEach(r => {
      const areaSqM = r.lengthMeters * r.widthMeters;
      totalUsableSqFt += DimensionParser.squareMetersToSquareFeet(areaSqM);
    });

    setVerificationDraft({
      ...verificationDraft,
      rooms: savedRooms,
      usableArea: totalUsableSqFt
    });
  }, [rooms]);

  const handleAddRoom = () => {
    const newRoom: RoomData = {
      id: `room_${Date.now()}`,
      name: `Room ${rooms.length + 1}`,
      lengthMeters: DimensionParser.feetInchesToMeters(10, 0),
      widthMeters: DimensionParser.feetInchesToMeters(10, 0),
      unit: displayUnit === 'metric' ? 'meterCm' : 'feetInches',
      isAutoExtracted: false,
      isUserVerified: true,
    };
    setRooms(prev => [...prev, newRoom]);
    setMode('manual');
  };

  const handleUpdateRoom = (index: number, updated: RoomData) => {
    setRooms(prev => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleRemoveRoom = (index: number) => {
    setRooms(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddIndividualRoom = (newRoom: RoomData, keepOpen = false) => {
    setRooms(prev => [...prev, newRoom]);
    if (!keepOpen) {
      setIsAddIndividualModalOpen(false);
    }
    setMode('manual');
  };

  // OCR Logic (Reused from ScannerView)
  const processImageOcr = async (imageDataUrl: string, sampleOverride?: SampleFloorPlan) => {
    setIsProcessing(true);
    setOcrProgress(10);
    setOcrStatusText('Initializing OCR...');

    if (sampleOverride) {
      setTimeout(() => {
        setOcrProgress(100);
        setIsProcessing(false);
        setExtractedRawText(sampleOverride.ocrText);
        const pairs: PendingRoomPair[] = sampleOverride.rooms.map((r, i) => ({
          id: `sample_pair_${i + 1}`,
          name: r.name,
          lengthStr: r.length,
          widthStr: r.width,
          isExcluded: false,
        }));
        setPendingPairs(pairs);
        setIsReviewModalOpen(true);
      }, 500);
      return;
    }

    try {
      const worker = await createWorker('eng');
      setOcrProgress(50);
      const ret = await worker.recognize(imageDataUrl);
      await worker.terminate();
      setOcrProgress(90);
      const text = ret.data.text || '';
      setExtractedRawText(text);
      const parsed = DimensionScanParser.parseRooms(text);
      const pairs: PendingRoomPair[] = parsed.map((p, idx) => ({
        id: `ocr_pair_${idx + 1}`,
        name: p.name,
        lengthStr: p.length,
        widthStr: p.width,
        isExcluded: false,
      }));
      setPendingPairs(pairs);
      setIsReviewModalOpen(true);
    } catch (err) {
      console.warn('OCR fallback', err);
      setIsReviewModalOpen(true);
    } finally {
      setIsProcessing(false);
      setOcrProgress(100);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      processImageOcr(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyReviewPairs = (confirmed: PendingRoomPair[]) => {
    const newRooms: RoomData[] = confirmed.map((c, i) => {
      const lenM = DimensionParser.parseDimensionToMeters(c.lengthStr);
      const widM = DimensionParser.parseDimensionToMeters(c.widthStr);
      return {
        id: `ocr_room_${Date.now()}_${i}`,
        name: c.name,
        lengthMeters: lenM > 0 ? lenM : DimensionParser.feetInchesToMeters(10, 0),
        widthMeters: widM > 0 ? widM : DimensionParser.feetInchesToMeters(10, 0),
        unit: displayUnit === 'metric' ? 'meterCm' : 'feetInches',
        isAutoExtracted: true,
        isUserVerified: false, // Must be reviewed/confirmed
        sourcePairId: c.id,
      };
    });
    setRooms(prev => [...prev, ...newRooms]);
    setIsReviewModalOpen(false);
    setMode('scan');
  };

  const handleVerifyRoom = (index: number) => {
    setRooms(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isUserVerified: true };
      return copy;
    });
  };

  const unverifiedCount = rooms.filter(r => r.isAutoExtracted && !r.isUserVerified).length;
  const verifiedCount = rooms.filter(r => r.isUserVerified).length;
  
  const canContinue = verifiedCount > 0 && unverifiedCount === 0;

  // Calculation (Simplified for summary)
  let totalUsableSqFt = 0;
  rooms.filter(r => r.isUserVerified).forEach(r => {
    totalUsableSqFt += DimensionParser.squareMetersToSquareFeet(r.lengthMeters * r.widthMeters);
  });

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 sm:px-0">
      {/* Navigation & Progress */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors mb-6 group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">Builder-Stated Area</span>
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2457D6] bg-blue-50 px-2 py-0.5 rounded-full">Step 3 of 5</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-3/5 h-full bg-[#2457D6] rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">Your Measurements</h1>
        </div>
      </div>

      {mode === 'selection' && rooms.length === 0 ? (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#172033]">How would you like to add your measurements?</h2>
            <p className="text-sm text-[#697386] mt-1 leading-relaxed">
              Enter room measurements manually or scan a floor plan to extract dimensions for review.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setMode('manual')}
              className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 hover:shadow-lg transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Ruler className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-[#172033]">Manual Entry</h3>
                  <p className="text-sm text-[#64748B] font-medium">Enter room dimensions yourself.</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600" />
              </div>
            </button>

            <button
              onClick={() => setMode('scan')}
              className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 hover:shadow-lg transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Scan className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-[#172033]">Scan Blueprint</h3>
                  <p className="text-sm text-[#64748B] font-medium">Upload or scan a floor plan and review detected dimensions.</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-[#172033] uppercase tracking-wider">Measurement Summary</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-[#64748B]">{rooms.length} Rooms total</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-xs font-bold text-emerald-600">{verifiedCount} Verified</span>
                {unverifiedCount > 0 && (
                  <>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-xs font-bold text-amber-600">{unverifiedCount} Review required</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Measured Usable Area</div>
              <div className="text-xl font-black text-[#2457D6]">
                {DimensionParser.formatArea(totalUsableSqFt, displayUnit)}
              </div>
            </div>
          </div>

          {unverifiedCount > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3 text-amber-800 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Some detected measurements still need your review.</span>
            </div>
          )}

          {/* Room Lists */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-[#64748B] uppercase tracking-widest">Room List</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddIndividualModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-xl flex items-center gap-1.5 border border-blue-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Room</span>
                </button>
                <button
                  onClick={() => setMode('scan')}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-xl flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Scan More</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {rooms.map((room, idx) => (
                room.isAutoExtracted ? (
                  <ScanRoomCard
                    key={room.id}
                    room={room}
                    displayUnit={displayUnit}
                    onUpdate={updated => handleUpdateRoom(idx, updated)}
                    onRemove={() => handleRemoveRoom(idx)}
                  />
                ) : (
                  <RoomCard
                    key={room.id}
                    room={room}
                    index={idx}
                    displayUnit={displayUnit}
                    totalAggregateCarpetSqFt={totalUsableSqFt}
                    onUpdate={updated => handleUpdateRoom(idx, updated)}
                    onRemove={() => handleRemoveRoom(idx)}
                  />
                )
              ))}
            </div>
          </div>

          {mode === 'scan' && (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[#64748B] uppercase tracking-widest">Scan Actions</h3>
              </div>
              
              {isProcessing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-2">
                      <ScanLine className="w-4 h-4 animate-spin text-blue-600" />
                      {ocrStatusText}
                    </span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#172033] hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#172033] hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Camera</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Primary Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:mt-12">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`w-full h-16 ${canContinue ? 'bg-[#2457D6] hover:bg-[#1D47B0]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} text-white font-black text-lg rounded-[24px] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer`}
        >
          <span>Continue to Comparison</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <AddIndividualRoomModal
        isOpen={isAddIndividualModalOpen}
        onClose={() => setIsAddIndividualModalOpen(false)}
        onAddRoom={handleAddIndividualRoom}
        displayUnit={displayUnit}
        existingRoomCount={rooms.length}
      />

      <OcrDimensionReviewModal
        isOpen={isReviewModalOpen}
        rawText={extractedRawText}
        initialPairs={pendingPairs}
        onClose={() => setIsReviewModalOpen(false)}
        onApply={handleApplyReviewPairs}
      />
    </div>
  );
};
