import { ListItemButton, ListItemButtonBaseProps, ListItemIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

// Custom interface for extended ListItemButtons
interface QuestionButtonProps extends ListItemButtonBaseProps {
    questionID: string;
    completionStatus: number;
    clickFunction: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id : string) => void;
}

export const QuestionButton: React.FC<QuestionButtonProps> = ({ questionID, completionStatus, clickFunction }) => {
    let icon : React.ReactNode;
    let backgroundColor : string | undefined;

    if (completionStatus == 2) {
        icon = <CheckIcon />,
        backgroundColor = '#EFF7EE'
    } else if (completionStatus == 1) {
        icon = <CloseIcon />,
        backgroundColor = '#FDF4E7'
    } else {
        icon = <RemoveIcon/>
    }

    return (
      <ListItemButton
        sx={{ flex: '1', justifyContent: 'space-between', backgroundColor }} 
        onClick={(e) => clickFunction(e, questionID)}
      >
        Question #{questionID}
            <ListItemIcon sx={{justifyContent: 'flex-end'}}>
                {icon}
            </ListItemIcon>
      </ListItemButton>
    );
  };